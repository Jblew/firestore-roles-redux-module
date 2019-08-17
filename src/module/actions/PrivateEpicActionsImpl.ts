import { Account } from "../../Account";

import { PrivateEpicActions } from "./PrivateEpicActions";

export class PrivateEpicActionsImpl implements PrivateEpicActions {
    public ensureAccountRegistered(account: Account): PrivateEpicActions.EnsureAccountRegisteredAction {
        throw new Error("Not implemented yet");
    }
}
