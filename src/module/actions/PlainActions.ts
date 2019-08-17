import { Account } from "../../Account";

// tslint:disable class-name

export namespace PlainActions {
    export const AUTH_LOADING = "FirestoreRolesAuthReduxModule/PlainActions/AUTH_LOADING";
    export const AUTH_SUCCESS = "FirestoreRolesAuthReduxModule/PlainActions/AUTH_SUCCESS";
    export const AUTH_FAILURE = "FirestoreRolesAuthReduxModule/PlainActions/AUTH_FAILURE";
    export const AUTH_NOTAUTHENTICATED = "FirestoreRolesAuthReduxModule/PlainActions/AUTH_NOTAUTHENTICATED";
    export const SET_ROLE_STATUS = "FirestoreRolesAuthReduxModule/PlainActions/SET_ROLE_STATUS";
    export const SET_ROLE_REQUEST_STATUS = "FirestoreRolesAuthReduxModule/PlainActions/SET_ROLE_REQUEST_STATUS";

    export interface AuthLoading {
        type: typeof AUTH_LOADING;
    }

    export interface AuthSuccess {
        type: typeof AUTH_SUCCESS;
        account: Account;
    }

    export interface AuthFailure {
        type: typeof AUTH_FAILURE;
        error: string;
    }

    export interface AuthNotAuthenticated {
        type: typeof AUTH_NOTAUTHENTICATED;
    }

    export interface SetRoleStatus {
        type: typeof SET_ROLE_STATUS;
        role: string;
        hasRole: boolean;
    }

    export interface SetRoleRequestStatus {
        type: typeof SET_ROLE_REQUEST_STATUS;
        role: string;
        isRequestingRole: boolean;
    }

    export type Types =
        | AuthLoading
        | AuthSuccess
        | AuthFailure
        | AuthNotAuthenticated
        | SetRoleStatus
        | SetRoleRequestStatus;

    export const plainActions = {
        authLoading: (): AuthLoading => ({
            type: AUTH_LOADING,
        }),
        authSuccess: (account: Account): AuthSuccess => ({
            type: AUTH_SUCCESS,
            account,
        }),
        authFailure: (error: string): AuthFailure => ({
            type: AUTH_FAILURE,
            error,
        }),
        authNotAuthenticated: (): AuthNotAuthenticated => ({
            type: AUTH_NOTAUTHENTICATED,
        }),
        setRoleStatus: (role: string, hasRole: boolean): SetRoleStatus => ({
            type: SET_ROLE_STATUS,
            role,
            hasRole,
        }),
        setRoleRequestStatus: (role: string, isRequestingRole: boolean): SetRoleRequestStatus => ({
            type: SET_ROLE_REQUEST_STATUS,
            role,
            isRequestingRole,
        }),
    };
}
