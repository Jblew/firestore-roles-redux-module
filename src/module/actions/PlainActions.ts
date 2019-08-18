import { ActionType, createAction } from "typesafe-actions";

import { Account } from "../../Account";

export namespace PlainActions {
    export const AUTH_LOADING = "FirestoreRolesAuthReduxModule/PlainActions/AUTH_LOADING";
    export const AUTH_SUCCESS = "FirestoreRolesAuthReduxModule/PlainActions/AUTH_SUCCESS";
    export const AUTH_FAILURE = "FirestoreRolesAuthReduxModule/PlainActions/AUTH_FAILURE";
    export const AUTH_NOTAUTHENTICATED = "FirestoreRolesAuthReduxModule/PlainActions/AUTH_NOTAUTHENTICATED";
    export const SET_ROLE_STATUS = "FirestoreRolesAuthReduxModule/PlainActions/SET_ROLE_STATUS";
    export const SET_ROLE_REQUEST_STATUS = "FirestoreRolesAuthReduxModule/PlainActions/SET_ROLE_REQUEST_STATUS";

    export namespace Actions {
        export const authLoading = createAction(AUTH_LOADING, action => () => action(AUTH_LOADING));
        export const authSuccess = createAction(AUTH_SUCCESS, action => (account: Account) => action(account));
        export const authFailure = createAction(AUTH_FAILURE, action => (error: string) => action(error));
        export const authNotAuthenticated = createAction(AUTH_NOTAUTHENTICATED, action => () => action());
        export const setRoleStatus = createAction(SET_ROLE_STATUS, action => (role: string, is: boolean) =>
            action({ role, is }),
        );
        export const setRoleRequestStatus = createAction(
            SET_ROLE_REQUEST_STATUS,
            action => (role: string, is: boolean) => action({ role, is }),
        );
    }

    export type Type = ActionType<typeof Actions>;
}
