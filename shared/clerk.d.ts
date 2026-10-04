export {};

declare global {
  interface CustomJwtSessionClaims {
    userId?: string;
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  }
}