import { FirestoreRolesConfiguration } from "firestore-roles";
import * as _ from "lodash";
import { applyMiddleware, combineReducers, createStore, Reducer } from "redux";
import configureStore from "redux-mock-store";

import { AuthAdapter } from "../adapter/AuthAdapter";
import { RolesAdapter } from "../adapter/RolesAdapter";
import { Configuration } from "../Configuration";
import thunk, { ThunkMiddleware } from "../thunk";

import { EpicActionsImpl } from "./actions/EpicActionsImpl";
import { getModuleWithAdapters, RolesAuthModule } from "./RolesAuthModule";

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
    return createStore(rootReducer, initialState, applyMiddleware<ThunkMiddleware>(thunk));
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
    return {
        storeMock,
        store,
        authAdapter,
        rolesAdapter,
        raModule,
        callbacks,
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
