export const ReviewEventType = {
  CreateReview: 'create_review',
  UpdateReview: 'update_review',
  GetReviewsByAuthor: 'get_reviews_by_author',
  GetReviewsByBook: 'get_reviews_by_book',
  GetReviewById: 'get_review_by_id',
  GetPopularReviewsByBook: 'get_popular_reviews_by_book',
  ReactToReview: 'react_to_review',
  UnreactToReview: 'unreact_to_review',
  DeleteReview: 'delete_review',
} as const;
