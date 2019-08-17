import { IModule } from "redux-dynamic-modules";

import { Account as _Account } from "../Account";
import { AuthState as _AuthState } from "../AuthState";
import { Configuration } from "../Configuration";

import { State as _State } from "./State";

export namespace RolesAuthModule {
    export import Account = _Account;
    export import AuthState = _AuthState;
    export import State = _State;

    export function getModule(config: Configuration): IModule<RolesAuthModule.State> {
        return {
            id: "rolesAuth",
            reducerMap: {
                rolesAuth: rolesReducer,
            },
            // Actions to fire when this module is added/removed
            // initialActions: [],
            // finalActions: []
        };
    }
}
