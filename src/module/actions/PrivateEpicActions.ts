// tslint:disable class-name
import { ThunkAction } from "redux-thunk";

import { Account } from "../../Account";
import { State } from "../State";

export interface PrivateEpicActions {
    ensureAccountRegistered(
        account: Account,
    ): ThunkAction<
        PrivateEpicActions.EnsureAccountRegisteredAction,
        State,
        void,
        PrivateEpicActions.EnsureAccountRegisteredAction
    >;
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
