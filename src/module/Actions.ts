// tslint:disable class-name
import { Account } from "../Account";

export interface Actions {
    logout(): Actions.LogoutAction;
    checkRole(): Actions.CheckRoleAction;
    _initialize(): Actions._InitializeAction;
    _ensureAccountRegistered(account: Account): Actions._EnsureAccountRegisteredAction;
}

export namespace Actions {
    export const _INITIALIZE = "FirestoreRolesAuthReduxModule/INITIALIZE";
    export const LOGOUT = "FirestoreRolesAuthReduxModule/LOGOUT";
    export const CHECK_ROLE = "FirestoreRolesAuthReduxModule/CHECK_ROLE";
    export const _ENSURE_ACCOUNT_REGISTERED = "FirestoreRolesAuthReduxModule/ENSURE_ACCOUNT_REGISTERED";

    export interface _InitializeAction {
        type: typeof _INITIALIZE;
    }

    export interface LogoutAction {
        type: typeof LOGOUT;
    }

    export interface CheckRoleAction {
        type: typeof CHECK_ROLE;
        role: string;
    }

    export interface _EnsureAccountRegisteredAction {
        type: typeof _ENSURE_ACCOUNT_REGISTERED;
        account: Account;
    }

    export type Types = LogoutAction | CheckRoleAction | _InitializeAction | _EnsureAccountRegisteredAction;
}
