import {
  CreateReviewEvent,
  ReactToReviewEvent,
  UnreactToReviewEvent,
  GetPopularReviewsByBookEvent,
  GetReviewsByAuthorEvent,
  GetReviewsByBookEvent,
  GetReviewByIdEvent,
  UpdateReviewEvent,
  DeleteReviewEvent,
} from '../../../events/review';

export type ReviewEvent =
  | CreateReviewEvent
  | ReactToReviewEvent
  | UnreactToReviewEvent
  | GetPopularReviewsByBookEvent
  | GetReviewsByAuthorEvent
  | GetReviewsByBookEvent
  | GetReviewByIdEvent
  | UpdateReviewEvent
  | DeleteReviewEvent;
