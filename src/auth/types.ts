import { User } from "../models/User";

export interface AuthState {
    isAuthenticated?: false,
    isInitialized?: false,
    user: User | null,
}