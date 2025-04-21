export interface IRateLimitInfo {
  limit: number | null;
  remaining: number | null;
  reset: number | null;
}