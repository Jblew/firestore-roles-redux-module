// tslint:disable class-name

import { Account } from "../../Account";
import { ThunkAction } from "../../thunk";
import { ContainingStoreState } from "../ContainingStoreState";

export interface PrivateEpicActions {
    ensureAccountRegistered(
        account: Account,
    ): ThunkAction<Promise<PrivateEpicActions.EnsureAccountRegisteredAction>, ContainingStoreState>;
}

export namespace PrivateEpicActions {
    export const ENSURE_ACCOUNT_REGISTERED =
        "FirestoreRolesAuthReduxModule/PrivateEpicActions/ENSURE_ACCOUNT_REGISTERED";

    export interface EnsureAccountRegisteredAction {
        type: typeof ENSURE_ACCOUNT_REGISTERED;
        account: Account;
    }

    export type Type = EnsureAccountRegisteredAction;
}
