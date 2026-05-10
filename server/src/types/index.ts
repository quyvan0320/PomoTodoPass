import { Request } from "express";

export interface AuthUser {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string | null;
  totalTimepoints: number;
  streakCount: number;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
