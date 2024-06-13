import {
  AUTH_SERVICE,
  REVIEW_SERVICE,
  servicesDefinition,
} from '@app/common/microservices/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { CreateReviewSaga } from 'services/api-gateway/src/modules/reviews/sagas/create-review/create-review.saga';
import { ReviewsService } from './reviews.service';
import { ClientKafka } from '@nestjs/microservices';
import { CreateReviewDto, ReactReviewDto } from './dto/requests';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let reviewClient: ClientKafka;
  let createReviewSaga: CreateReviewSaga;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: CreateReviewSaga,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: servicesDefinition[REVIEW_SERVICE].name,
          useValue: {
            subscribeToResponseOf: jest.fn(),
            send: jest.fn(),
          },
        },
        {
          provide: servicesDefinition[AUTH_SERVICE].name,
          useValue: {
            subscribeToResponseOf: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    createReviewSaga = module.get<CreateReviewSaga>(CreateReviewSaga);
    reviewClient = module.get<ClientKafka>(
      servicesDefinition[REVIEW_SERVICE].name,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a review', async () => {
    const createReviewDto: CreateReviewDto = {
      bookId: 1,
      title: 'Test Review',
      text: 'This is a test review',
      score: 5,
    };
    jest.spyOn(createReviewSaga, 'execute');

    await service.create(1, createReviewDto);
    expect(createReviewSaga.execute).toHaveBeenCalledWith(
      expect.objectContaining(createReviewDto),
    );
  });

  it('should get a review by id', async () => {
    const reviewId = 1;
    const mockReview = { id: reviewId, title: 'Test Review' };
    jest
      .spyOn(reviewClient, 'send')
      .mockReturnValue(of({ review: mockReview }));

    const result = await service.getById(reviewId);
    expect(reviewClient.send).toHaveBeenCalled();
    expect(result).toEqual(mockReview);
  });

  it('should get reviews by author', async () => {
    const authorId = 1;
    const mockReviews = [{ id: 1, title: 'Test Review' }];
    jest
      .spyOn(reviewClient, 'send')
      .mockReturnValue(of({ reviews: mockReviews }));

    const result = await service.getByAuthor(authorId);
    expect(reviewClient.send).toHaveBeenCalled();
    expect(result).toEqual(mockReviews);
  });

  it('should get reviews by book', async () => {
    const bookId = 1;
    const mockReviews = [{ id: 1, title: 'Test Review' }];
    jest
      .spyOn(reviewClient, 'send')
      .mockReturnValue(of({ reviews: mockReviews }));

    const result = await service.getByBook(bookId);
    expect(reviewClient.send).toHaveBeenCalled();
    expect(result).toEqual(mockReviews);
  });

  it('should get popular reviews by book', async () => {
    const bookId = 1;
    const mockReviews = [{ id: 1, title: 'Test Review' }];
    jest
      .spyOn(reviewClient, 'send')
      .mockReturnValue(of({ reviews: mockReviews }));

    const result = await service.getPopularByBook(bookId);
    expect(reviewClient.send).toHaveBeenCalled();
    expect(result).toEqual(mockReviews);
  });

  it('should react to a review', async () => {
    const reactReviewDto: ReactReviewDto = {
      isLike: true,
      bookId: 1,
    };
    const mockReaction = { reviewId: 1, reactedById: 1 };
    jest
      .spyOn(reviewClient, 'send')
      .mockReturnValue(of({ reaction: mockReaction }));

    const result = await service.reactReview(1, reactReviewDto);
    expect(reviewClient.send).toHaveBeenCalled();
    expect(result).toEqual(mockReaction);
  });

  it('should unreact to a review', async () => {
    const mockReaction = { reviewId: 1, reactedById: 1 };
    jest.spyOn(reviewClient, 'send').mockReturnValue(of(mockReaction));

    const result = await service.unreactReview(1, 1);
    expect(reviewClient.send).toHaveBeenCalled();
    expect(result).toEqual(mockReaction);
  });

  it('should delete a review', async () => {
    const mockReviewId = 1;
    const mockReview = { id: mockReviewId, title: 'Test Review', authorId: 1 };

    jest.spyOn(reviewClient, 'send').mockImplementation((eventType) => {
      switch (eventType) {
        case 'get_review_by_id':
          return of({ review: mockReview });
        case 'delete_review':
          return of({ id: mockReviewId });
        default:
          return of();
      }
    });

    const result = await service.delete(1, mockReviewId);
    expect(reviewClient.send).toHaveBeenCalled();
    expect(result).toEqual(mockReviewId);
  });
});
