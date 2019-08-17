// tslint:disable class-name
import { Account } from "../../Account";

export interface PrivateEpicActions {
    initialize(): PrivateEpicActions.InitializeAction;
    ensureAccountRegistered(account: Account): PrivateEpicActions.EnsureAccountRegisteredAction;
}

export namespace PrivateEpicActions {
    export const INITIALIZE = "FirestoreRolesAuthReduxModule/PrivateEpicActions/INITIALIZE";
    export const ENSURE_ACCOUNT_REGISTERED =
        "FirestoreRolesAuthReduxModule/PrivateEpicActions/ENSURE_ACCOUNT_REGISTERED";

    export interface InitializeAction {
        type: typeof INITIALIZE;
    }

    export interface EnsureAccountRegisteredAction {
        type: typeof ENSURE_ACCOUNT_REGISTERED;
        account: Account;
    }

    export type Type = InitializeAction | EnsureAccountRegisteredAction;
}
