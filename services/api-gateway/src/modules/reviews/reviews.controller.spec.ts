import { JwtAuthGuard } from '@app/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Reaction, Review, User } from '@app/repositories';
import { CreateReviewDto, ReactReviewDto } from './dto/requests';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let service: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: {
            getById: jest.fn(),
            getByBook: jest.fn(),
            getPopularByBook: jest.fn(),
            getByAuthor: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            reactReview: jest.fn(),
            unreactReview: jest.fn(),
            delete: jest.fn(),
          },
        },
        JwtAuthGuard,
        {
          provide: 'auth_service',
          useValue: {
            subscribeToResponseOf: jest.fn(),
            send: jest.fn(),
          },
        },
        {
          provide: 'authClient',
          useValue: {
            subscribeToResponseOf: jest.fn(),
            send: jest.fn(),
          },
        },
        Reflector,
      ],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get review by id', async () => {
    const id = '1';
    const review = {
      id: 1,
      title: 'Test Review',
      author: 'Test Author',
      authorId: 1,
      book: 'Test Book',
      bookId: 1,
    } as undefined as Review;
    jest.spyOn(service, 'getById').mockResolvedValue(review);

    expect(await controller.getById(id)).toBe(review);
  });

  it('should get reviews by book id', async () => {
    const bookId = '1';
    const reviews = [{ id: 1, title: 'Test Review' }] as undefined as Review[];
    jest.spyOn(service, 'getByBook').mockResolvedValue(reviews);

    expect(await controller.getByBookId(bookId)).toBe(reviews);
  });

  it('should get popular reviews by book id', async () => {
    const bookId = '1';
    const reviews = [{ id: 1, title: 'Test Review' }] as undefined as Review[];
    jest.spyOn(service, 'getPopularByBook').mockResolvedValue(reviews);

    expect(await controller.getPopularByBookId(bookId)).toBe(reviews);
  });

  it('should get reviews by author', async () => {
    const userId = '1';
    const reviews = [{ id: 1, title: 'Test Review' }] as undefined as Review[];
    jest.spyOn(service, 'getByAuthor').mockResolvedValue(reviews);

    expect(await controller.getByAuthor(userId)).toBe(reviews);
  });

  it('should create a review', async () => {
    const user = { id: 1 } as undefined as User;
    const dto = {
      title: 'Test Review',
      content: 'Test Content',
    } as undefined as CreateReviewDto;

    expect(await controller.create(user, dto)).toBe(undefined);
  });

  it('should update a review', async () => {
    const user = { id: 1 } as undefined as User;
    const dto = { id: 1, title: 'Updated Review', content: 'Updated Content' };
    const review = {
      id: 1,
      title: 'Updated Review',
      content: 'Updated Content',
    } as undefined as Review;
    jest.spyOn(service, 'update').mockResolvedValue(Promise.resolve(review));

    expect(await controller.update(user, dto)).toBe(review);
  });

  it('should react to a review', async () => {
    const user = { id: 1 } as undefined as User;
    const dto = { reviewId: 1 } as undefined as ReactReviewDto;

    expect(await controller.react(user, dto)).toBe(undefined);
  });

  it('should unreact to a review', async () => {
    const user = { id: 1 } as undefined as User;
    const id = '1';
    const reaction = { id: 1, userId: 1, reviewId: 1 } as undefined as Reaction;
    jest.spyOn(service, 'unreactReview').mockResolvedValue(reaction);

    expect(await controller.unreact(user, id)).toBe(reaction);
  });

  it('should delete a review', async () => {
    const user = { id: 1 } as undefined as User;
    const id = '1';
    const reviewId = 1;
    jest.spyOn(service, 'delete').mockResolvedValue(reviewId);

    expect(await controller.delete(user, id)).toBe(reviewId);
  });
});
