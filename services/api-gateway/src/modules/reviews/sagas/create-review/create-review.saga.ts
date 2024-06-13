import { Step } from '@app/common/microservices/transactions';
import { Review } from '@app/repositories';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CheckReviewStep } from './steps/check-review.step';
import { ConfirmReviewStep } from './steps/confirm-review.step';
import { IncreaseKarmaStep } from './steps/increase-karma.step';
import { PlaceReviewStep } from './steps/place-review.step';

@Injectable()
export class CreateReviewSaga {
  private steps: Step<Review, Review>[] = [];
  private successfulSteps: Step<Review, Review>[] = [];
  private readonly logger = new Logger(CreateReviewSaga.name);

  constructor(
    @Inject('place-review-step') step1: PlaceReviewStep,
    @Inject('check-review-step') step2: CheckReviewStep,
    @Inject('confirm-review-step') step3: ConfirmReviewStep,
    @Inject('increase-carma-step') step4: IncreaseKarmaStep,
  ) {
    this.steps = [step1, step2, step3, step4];
  }

  async execute(_review: Review) {
    this.logger.log(
      `Review Creation Transaction started: ${JSON.stringify(_review)}`,
    );
    this.logger.log(`Steps: ${this.steps.map((s) => s.name).join(', ')}`);
    let review = _review;
    for (const step of this.steps) {
      try {
        this.logger.log(`Invoking: ${step.name} ...`);
        review = await step.invoke(review);
        this.logger.log(`Step: ${step.name} successful`);
        this.successfulSteps.unshift(step);
      } catch (error) {
        this.logger.error(`Failed Step: ${step.name} !!`, error.stack, error);
        for (const s of this.successfulSteps) {
          this.logger.log(`Rollbacking: ${s.name} ...`);
          review = await s.withCompensation(review);
        }
        throw error;
      }
    }

    return review;
    this.logger.log('Review Creation Transaction ended successfuly');
  }
}
