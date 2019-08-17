import { combineReducers } from "redux";
import { createReducer } from "typesafe-actions";

import { Account } from "../Account";
import { AuthState } from "../AuthState";

import { PlainActions } from "./actions/PlainActions";
import { State } from "./State";
import { RootAction } from "./types";

const authState = createReducer<AuthState>(AuthState.NOTAUTHENTICATED) //
    .handleAction(PlainActions.Actions.authLoading, () => AuthState.LOADING)
    .handleAction(PlainActions.Actions.authFailure, () => AuthState.NOTAUTHENTICATED)
    .handleAction(PlainActions.Actions.authNotAuthenticated, () => AuthState.NOTAUTHENTICATED)
    .handleAction(PlainActions.Actions.authSuccess, () => AuthState.AUTHENTICATED);

const account = createReducer<Account | undefined>(undefined) //
    .handleAction([PlainActions.Actions.authNotAuthenticated, PlainActions.Actions.authFailure], () => undefined)
    .handleAction(PlainActions.Actions.authSuccess, (state, action) => action.payload);

const roles = createReducer<{ [roleName: string]: boolean }>({}) //
    .handleAction(PlainActions.Actions.setRoleStatus, (state, action) => ({
        ...state,
        [action.payload.role]: action.payload.hasRole,
    }));

const roleRequests = createReducer<{ [roleName: string]: boolean }>({}) //
    .handleAction(PlainActions.Actions.setRoleRequestStatus, (state, action) => ({
        ...state,
        [action.payload.role]: action.payload.isRequestingRole,
    }));

const rootReducer = combineReducers<State, RootAction>({
    state: authState,
    account,
    roles,
    roleRequests,
});

export default rootReducer;
