import { Types as mongooseTypes } from "mongoose";

export interface TeamSocials {
  twitter: string;
  website: string;
}

// The params an error errorMessage can take
export interface ErrorMessageParams {
  statusCode?: number;
  errorMessage?: string;
  details?: string;
  errorCode?: string;
}

// The data that is sent back to the client on an error
export interface ErrorResponse {
  errors: {
    errorMessage: string;
    details?: string;
    errorCode?: string;
  };
}

// User data that doesn't contain any sensitive information
export interface BasicUserDetails {
  id: mongooseTypes.ObjectId | string;
  usernameCapitalization: string;
  isAdmin: boolean;
  username: string;
}

export interface TokenData {
  jwtToken: string;
  refreshToken: string;
}

// The full data that is returned by the user service when doing auth
export interface AuthenticatedUserData {
  user: BasicUserDetails;
  jwtToken: string;
  refreshToken: string;
}

export interface UserDetailsUpdateData {
  username?: string;
  capitalization?: string;
  password?: string;
}

export interface JWTData {
  id: string;
  sub: string;
  isAdmin?: boolean;
}

export interface TeamDetailsUpdateData {
  name: string;
  socials: TeamSocials;
}

export interface InviteOptions {
  maxUses: number;
  expiry: Date;
}

export interface BasicInvite {
  team: mongooseTypes.ObjectId | string;
  inviteCode: string;
  createdByUser: mongooseTypes.ObjectId | string;
}
