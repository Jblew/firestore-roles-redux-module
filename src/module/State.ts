import ow from "ow";

import { Account } from "../Account";
import { AuthState } from "../AuthState";
import { ow_catch } from "../util";

export interface State {
    state: AuthState;
    account?: Account;
    roles: {
        [roleName: string]: boolean;
    };
    roleRequests: {
        [roleName: string]: boolean;
    };
}

export namespace State {
    export function validate(state: State) {
        ow(
            state.state,
            "state.state",
            ow.string.oneOf([AuthState.LOADING, AuthState.AUTHENTICATED, AuthState.NOTAUTHENTICATED]),
        );

        ow(
            state.account,
            "state.account",
            ow.any(ow.undefined, ow.object.is(v => ow_catch(() => Account.validate(v as Account)))),
        );

        ow(state.roles, "state.roles", ow.object.valuesOfType(ow.boolean));
        ow(state.roleRequests, "state.roleRequests", ow.object.valuesOfType(ow.boolean));
    }
}
