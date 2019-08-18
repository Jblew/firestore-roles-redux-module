import { combineReducers } from "redux";
import { createReducer } from "typesafe-actions";

import { Account } from "../Account";
import { AuthState } from "../AuthState";

import { PlainActions } from "./actions/PlainActions";
import { State } from "./State";
import { RootAction } from "./types";

function authStateReducer() {
    return createReducer<AuthState>(AuthState.NOTAUTHENTICATED) //
        .handleAction(PlainActions.Actions.authLoading, () => AuthState.LOADING)
        .handleAction(PlainActions.Actions.authNotAuthenticated, () => AuthState.NOTAUTHENTICATED)
        .handleAction(PlainActions.Actions.authSuccess, () => AuthState.AUTHENTICATED);
}

function accountReducer() {
    return createReducer<Account | null>(null) //
        .handleAction(PlainActions.Actions.authNotAuthenticated, () => null)
        .handleAction(PlainActions.Actions.authSuccess, (state, action) => action.payload);
}

function roleRelatedReducer(
    setterAction: typeof PlainActions.Actions.setRoleStatus | typeof PlainActions.Actions.setRoleRequestStatus,
) {
    return createReducer<{ [roleName: string]: boolean }>({}) //
        .handleAction([PlainActions.Actions.authNotAuthenticated, PlainActions.Actions.authSuccess], () => ({}))
        .handleAction(setterAction, (state, action) => ({
            ...state,
            [action.payload.role]: action.payload.is,
        }));
}

export function configureReducer() {
    const rootReducer = combineReducers<State, RootAction>({
        state: authStateReducer(),
        account: accountReducer(),
        roles: roleRelatedReducer(PlainActions.Actions.setRoleStatus),
        roleRequests: roleRelatedReducer(PlainActions.Actions.setRoleRequestStatus),
    });
    return rootReducer;
}
