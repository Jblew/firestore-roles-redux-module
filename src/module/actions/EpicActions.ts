// tslint:disable class-name
import { ThunkAction } from "redux-thunk";

import { State } from "../State";

export interface EpicActions {
    initialize(): ThunkAction<EpicActions.InitializeAction, State, void, EpicActions.InitializeAction>;
    logout(): ThunkAction<EpicActions.LogoutAction, State, void, EpicActions.LogoutAction>;
    checkRole(role: string): ThunkAction<EpicActions.CheckRoleAction, State, void, EpicActions.CheckRoleAction>;
}

export namespace EpicActions {
    export const INITIALIZE = "FirestoreRolesAuthReduxModule/PrivateEpicActions/INITIALIZE";
    export const LOGOUT = "FirestoreRolesAuthReduxModule/EpicActions/LOGOUT";
    export const CHECK_ROLE = "FirestoreRolesAuthReduxModule/EpicActions/CHECK_ROLE";

    export interface InitializeAction {
        type: typeof INITIALIZE;
    }

    export interface LogoutAction {
        type: typeof LOGOUT;
    }

    export interface CheckRoleAction {
        type: typeof CHECK_ROLE;
        role: string;
    }

    export type Type = InitializeAction | LogoutAction | CheckRoleAction;
}
