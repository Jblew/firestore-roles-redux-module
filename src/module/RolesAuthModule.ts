import * as firebase from "firebase/app";
import { Reducer } from "typesafe-actions";

import { Account as _Account } from "../Account";
import { AuthAdapter } from "../adapter/AuthAdapter";
import { RolesAdapter } from "../adapter/RolesAdapter";
import { AuthState as _AuthState } from "../AuthState";
import { Configuration } from "../Configuration";

import { EpicActions } from "./actions/EpicActions";
import { EpicActionsImpl } from "./actions/EpicActionsImpl";
import { ContainingStoreState as _ContainingStoreState } from "./ContainingStoreState";
import { configureReducer } from "./reducer";
import { State as _State } from "./State";

export function getModuleWithAdapters<YOUR_STORE_STATE extends _ContainingStoreState>(
    config: Configuration,
    rolesAdapter: RolesAdapter,
    authAdapter: AuthAdapter,
) {
    const publicActions = new EpicActionsImpl(config.callbacks, rolesAdapter, authAdapter);
    return {
        reducer: configureReducer(),
        actions: publicActions,
    };
}

export namespace RolesAuthModule {
    export import Account = _Account;
    export import AuthState = _AuthState;
    export import State = _State;
    export import ContainingStoreState = _ContainingStoreState;

    export type PublicActions = EpicActions;
    export type PublicActionType = EpicActions.Type;

    export interface ModuleInitializer {
        reducer: Reducer<State, PublicActionType>;
        actions: PublicActions;
    }

    export function getModule<YOUR_STORE_STATE extends ContainingStoreState>(
        config: Configuration,
        firebaseAuth: firebase.auth.Auth,
        firestore: firebase.firestore.Firestore,
    ): ModuleInitializer {
        const rolesAdapter = new RolesAdapter(config, firestore);
        const authAdapter = new AuthAdapter(firebaseAuth);

        return getModuleWithAdapters<YOUR_STORE_STATE>(config, rolesAdapter, authAdapter);
    }
}
