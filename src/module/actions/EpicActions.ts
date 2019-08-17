// tslint:disable class-name

export interface EpicActions {
    logout(): EpicActions.LogoutAction;
    checkRole(): EpicActions.CheckRoleAction;
}

export namespace EpicActions {
    export const LOGOUT = "FirestoreRolesAuthReduxModule/EpicActions/LOGOUT";
    export const CHECK_ROLE = "FirestoreRolesAuthReduxModule/EpicActions/CHECK_ROLE";

    export interface LogoutAction {
        type: typeof LOGOUT;
    }

    export interface CheckRoleAction {
        type: typeof CHECK_ROLE;
        role: string;
    }

    export type Types = LogoutAction | CheckRoleAction;
}
