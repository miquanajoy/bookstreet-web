import { Dispatch, createContext } from "react";
import { AuthState } from "./types";

export enum AuthActionType {
    INITIALIZE = 'INITIALIZE',
    SIGN_IN = 'SIGN_IN',
    SIGN_OUT = 'SIGN_OUT',
}
export interface PayloadAction<T> {
    type: AuthActionType;
    payload: T;
}
export interface AuthContextType extends AuthState {
    dispatch: Dispatch<PayloadAction<AuthState>>;
}
const initialState: AuthState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};
export const AuthContext = createContext<AuthContextType>({
    ...initialState,
    dispatch: () => null,
});
