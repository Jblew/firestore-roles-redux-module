import { FirestoreRolesConfiguration } from "firestore-roles";
import * as _ from "lodash";
import { applyMiddleware, combineReducers, createStore, Reducer } from "redux";
import logger from "redux-logger";
import configureStore from "redux-mock-store";

import { AuthAdapter } from "../adapter/AuthAdapter";
import { RolesAdapter } from "../adapter/RolesAdapter";
import { AuthState } from "../AuthState";
import { Configuration } from "../Configuration";
import thunk, { ThunkMiddleware } from "../thunk";

import { EpicActionsImpl } from "./actions/EpicActionsImpl";
import { getModuleWithAdapters, RolesAuthModule } from "./RolesAuthModule";

const log = false;

const rolesConfig: FirestoreRolesConfiguration = FirestoreRolesConfiguration.DEFAULT;
function createStoreWithModule(
    initialState: any,
    raModule: {
        reducer: Reducer<RolesAuthModule.State, RolesAuthModule.PublicActionType>;
        actions: EpicActionsImpl;
    },
) {
    const rootReducer = combineReducers({
        rolesAuth: raModule.reducer,
    });
    const middleware = log ? applyMiddleware<ThunkMiddleware>(thunk, logger) : applyMiddleware<ThunkMiddleware>(thunk);
    return createStore(rootReducer, initialState, middleware);
}

export function mock(initialState?: any) {
    const callbacks: Configuration.AuthCallbacks = {
        onAuthenticated: jest.fn(),
        onNotAuthenticated: jest.fn(),
        onError: jest.fn(),
    };
    const config: Readonly<Configuration> = Object.freeze({
        roles: rolesConfig,
        callbacks,
    });
    const authAdapter: AuthAdapter = {} as any;
    const rolesAdapter: RolesAdapter = {} as any;
    const raModule = getModuleWithAdapters(config, rolesAdapter, authAdapter);
    const store = createStoreWithModule(initialState || {}, raModule);
    const storeMock = configureStore([thunk])();

    const sampleAccount = getSampleFirebaseAccount();
    return {
        storeMock,
        store,
        authAdapter,
        rolesAdapter,
        raModule,
        callbacks,
        sampleAccount,
    };
}

export function getSampleFirebaseAccount(): firebase.UserInfo {
    const uid = `u_${Math.random()}`;
    return {
        uid,
        displayName: `sample-account-${uid}`,
        email: `${uid}@sample.sample`,
        providerId: "google",
        photoURL: null,
        phoneNumber: null,
    };
}

/**
 * Domain language
 */
export const expectAuthState = (m: ReturnType<typeof mock>, state: AuthState) =>
    expect(m.store.getState().rolesAuth.state).toEqual(state);

export const expectActionDispatched = (m: ReturnType<typeof mock>, actionType: string) =>
    expect(m.storeMock.getActions().map(a => a.type)).toContainEqual(actionType);
