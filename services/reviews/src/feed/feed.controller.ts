import { ReviewEventType } from '@app/common/microservices/constants';
import {
  CreateReviewEvent,
  CreateReviewEventResponse,
  DeleteReviewEvent,
  DeleteReviewEventResponse,
  GetPopularReviewsByBookEvent,
  GetPopularReviewsByBookEventResponse,
  GetReviewByIdEvent,
  GetReviewByIdEventResponse,
  GetReviewsByAuthorEvent,
  GetReviewsByAuthorEventResponse,
  GetReviewsByBookEvent,
  GetReviewsByBookEventResponse,
  ReactToReviewEvent,
  ReactToReviewEventResponse,
  UnreactToReviewEvent,
  UnreactToReviewEventResponse,
  UpdateReviewEvent,
  UpdateReviewEventResponse,
} from '@app/common/microservices/events/review';
import { ReviewEventHandlerController } from '@app/common/microservices/types/events/review';
import { Review } from '@app/repositories';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ReviewFeedService } from './feed.service';

@Controller()
export class ReviewFeedController implements ReviewEventHandlerController {
  constructor(private readonly reviewFeedService: ReviewFeedService) {}

  @MessagePattern(ReviewEventType.CreateReview)
  async handleCreateReview(
    payload: CreateReviewEvent,
  ): Promise<CreateReviewEventResponse> {
    const review = await this.reviewFeedService.createReview(payload);
    return new CreateReviewEventResponse(review);
  }

  @MessagePattern(ReviewEventType.UpdateReview)
  async handleUpdateReview(payload: UpdateReviewEvent) {
    const updateResult = await this.reviewFeedService.updateReview(payload);

    let review: Review;

    if (updateResult.affected) {
      review = await this.reviewFeedService.getById(payload.id);
    }

    return new UpdateReviewEventResponse(review);
  }

  @MessagePattern(ReviewEventType.GetReviewsByAuthor)
  async handleGetReviewsByAuthor(payload: GetReviewsByAuthorEvent) {
    const review = await this.reviewFeedService.getByAuthor(payload);

    return new GetReviewsByAuthorEventResponse(review);
  }

  @MessagePattern(ReviewEventType.GetReviewsByBook)
  async handleGetReviewsByBook(payload: GetReviewsByBookEvent) {
    const reviews = await this.reviewFeedService.getByBook(payload);

    return new GetReviewsByBookEventResponse(reviews);
  }

  @MessagePattern(ReviewEventType.GetReviewById)
  async handleGetReviewById(payload: GetReviewByIdEvent) {
    const review = await this.reviewFeedService.getById(payload.id);

    return new GetReviewByIdEventResponse(review);
  }

  @MessagePattern(ReviewEventType.GetPopularReviewsByBook)
  async handleGetPopularReviewsByBook(payload: GetPopularReviewsByBookEvent) {
    const reviews = await this.reviewFeedService.getPopularByBook(payload);

    return new GetPopularReviewsByBookEventResponse(reviews);
  }

  @MessagePattern(ReviewEventType.ReactToReview)
  async handleReactToReview(payload: ReactToReviewEvent) {
    const reaction = await this.reviewFeedService.reactToReview(payload);

    return new ReactToReviewEventResponse(reaction);
  }

  @MessagePattern(ReviewEventType.UnreactToReview)
  async handleUnreactToReview(payload: UnreactToReviewEvent) {
    const deleteResult = await this.reviewFeedService.unreactToReview(payload);

    if (!deleteResult.affected) {
      return new UnreactToReviewEventResponse();
    }

    return new UnreactToReviewEventResponse(
      payload.reviewId,
      payload.reactedById,
    );
  }

  @MessagePattern(ReviewEventType.DeleteReview)
  async handleDeleteReview(payload: DeleteReviewEvent) {
    const deleteResult = await this.reviewFeedService.deleteReview(payload);

    if (!deleteResult.affected) {
      return new DeleteReviewEventResponse();
    }

    return new DeleteReviewEventResponse(payload.id);
  }
}
