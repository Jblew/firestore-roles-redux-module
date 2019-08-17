import { action, ActionType, createAction } from "typesafe-actions";

import { Account } from "../../Account";

export namespace PlainActions {
    export const AUTH_LOADING = "FirestoreRolesAuthReduxModule/PlainActions/AUTH_LOADING";
    export const AUTH_SUCCESS = "FirestoreRolesAuthReduxModule/PlainActions/AUTH_SUCCESS";
    export const AUTH_FAILURE = "FirestoreRolesAuthReduxModule/PlainActions/AUTH_FAILURE";
    export const AUTH_NOTAUTHENTICATED = "FirestoreRolesAuthReduxModule/PlainActions/AUTH_NOTAUTHENTICATED";
    export const SET_ROLE_STATUS = "FirestoreRolesAuthReduxModule/PlainActions/SET_ROLE_STATUS";
    export const SET_ROLE_REQUEST_STATUS = "FirestoreRolesAuthReduxModule/PlainActions/SET_ROLE_REQUEST_STATUS";

    export namespace Actions {
        export const authLoading = () => action(AUTH_LOADING);
        export const authSuccess = (account: Account) => action(AUTH_SUCCESS, account);
        export const authFailure = (error: string) => action(AUTH_FAILURE, error);
        export const authNotAuthenticated = () => action(AUTH_NOTAUTHENTICATED);
        export const setRoleStatus = (role: string, hasRole: boolean) => action(SET_ROLE_STATUS, { role, hasRole });
        export const setRoleRequestStatus = (role: string, isRequestingRole: boolean) =>
            action(SET_ROLE_STATUS, { role, isRequestingRole });
    }

    export type Type = ActionType<typeof Actions>;
}
