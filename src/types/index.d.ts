export interface TeamSocials {
  twitter: string;
  website: string;
}

// The params an error message can take
export interface ErrorMessageParams {
  statusCode?: number;
  message?: string;
  details?: string;
  errorCode?: string;
}

// The data that is sent back to the client on an error
export interface ErrorResponse {
  errors: {
    message: string;
    details?: string;
    errorCode?: string;
  };
}
