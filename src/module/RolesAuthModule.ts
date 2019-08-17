import * as firebase from "firebase/app";

import { Account as _Account } from "../Account";
import { AuthState as _AuthState } from "../AuthState";
import { Configuration } from "../Configuration";

import { EpicActions } from "./actions/EpicActions";
import { EpicActionsImpl } from "./actions/EpicActionsImpl";
import rootReducer from "./reducer";
import { State as _State } from "./State";

export namespace RolesAuthModule {
    export import Account = _Account;
    export import AuthState = _AuthState;
    export import State = _State;
    export type PublicActions = EpicActions;
    export type PublicActionType = EpicActions.Type;

    export function getModule(
        config: Configuration,
        firebaseAuth: firebase.auth.Auth,
        firestore: firebase.firestore.Firestore,
    ) {
        const publicActions = new EpicActionsImpl(config, firebaseAuth, firestore);
        return {
            reducer: rootReducer,
            actions: publicActions,
        };
    }
}
