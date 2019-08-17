// tslint:disable class-name

export interface EpicActions {
    initialize(): EpicActions.InitializeAction;
    logout(): EpicActions.LogoutAction;
    checkRole(): EpicActions.CheckRoleAction;
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
