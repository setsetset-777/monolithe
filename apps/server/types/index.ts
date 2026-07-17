export interface HttpError extends Error {
  status?: number;
}

export type Locale = string | undefined;
