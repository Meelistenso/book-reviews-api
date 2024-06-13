import {
  CreateReviewEventResponse,
  DeleteReviewEventResponse,
  GetPopularReviewsByBookEventResponse,
  GetReviewByIdEventResponse,
  GetReviewsByAuthorEventResponse,
  GetReviewsByBookEventResponse,
  ReactToReviewEventResponse,
  UnreactToReviewEventResponse,
  UpdateReviewEventResponse,
} from '../../../events/review';

export type ReviewEventResponse =
  | CreateReviewEventResponse
  | UpdateReviewEventResponse
  | GetReviewsByAuthorEventResponse
  | GetReviewsByBookEventResponse
  | GetReviewByIdEventResponse
  | GetPopularReviewsByBookEventResponse
  | ReactToReviewEventResponse
  | UnreactToReviewEventResponse
  | DeleteReviewEventResponse;
