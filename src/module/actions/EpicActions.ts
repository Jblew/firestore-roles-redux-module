// tslint:disable class-name
import { ThunkAction } from "../../thunk";
import { ContainingStoreState } from "../ContainingStoreState";

export interface EpicActions {
    initialize(): ThunkAction<Promise<EpicActions.InitializeAction>, ContainingStoreState>;
    logout(): ThunkAction<Promise<EpicActions.LogoutAction>, ContainingStoreState>;
    checkRole(role: string): ThunkAction<Promise<EpicActions.CheckRoleAction>, ContainingStoreState>;
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
