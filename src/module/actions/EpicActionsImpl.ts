// tslint:disable no-console
import * as _ from "lodash";
import ow from "ow";
import { Dispatch } from "redux";

import { Account } from "../../Account";
import { AuthAdapter } from "../../adapter/AuthAdapter";
import { RolesAdapter } from "../../adapter/RolesAdapter";
import { Configuration } from "../../Configuration";
import { ThunkDispatch } from "../../thunk";
import { ContainingStoreState } from "../ContainingStoreState";

import { EpicActions } from "./EpicActions";
import { PlainActions } from "./PlainActions";
import { PrivateEpicActions } from "./PrivateEpicActions";

export class EpicActionsImpl implements EpicActions, PrivateEpicActions {
    private callbacks: Configuration.AuthCallbacks;
    private rolesAdapter: RolesAdapter;
    private authAdapter: AuthAdapter;

    public constructor(callbacks: Configuration.AuthCallbacks, rolesAdapter: RolesAdapter, authAdapter: AuthAdapter) {
        this.callbacks = callbacks;
        this.rolesAdapter = rolesAdapter;
        this.authAdapter = authAdapter;
    }

    public initialize() {
        const onAuthenticated = (dispatch: ThunkDispatch, user: firebase.UserInfo) => {
            const account = Account.fromFirebaseUserInfo(user);

            dispatch(this.ensureAccountRegistered(account));
            dispatch(PlainActions.Actions.authSuccess(account));
            this.callbacks.onAuthenticated(account);
        };

        const onNotAuthenticated = (dispatch: ThunkDispatch) => {
            dispatch(PlainActions.Actions.authNotAuthenticated());
            this.callbacks.onNotAuthenticated();
        };

        const onError = (dispatch: ThunkDispatch, msg: string) => {
            dispatch(PlainActions.Actions.authFailure(msg));
            this.callbacks.onError(msg);
        };

        return async (dispatch: Dispatch, getState: () => ContainingStoreState) => {
            dispatch(PlainActions.Actions.authLoading());

            await this.authAdapter.initialize({
                onAuthenticated: user => onAuthenticated(dispatch, user),
                onNotAuthenticated: () => onNotAuthenticated(dispatch),
                onError: msg => onError(dispatch, msg),
            });

            return this.initializeActionIntent();
        };
    }

    public logout() {
        return async (dispatch: Dispatch) => {
            dispatch(PlainActions.Actions.authLoading());
            try {
                await this.authAdapter.signOut();
                dispatch(PlainActions.Actions.authNotAuthenticated());
            } catch (error) {
                const errMsg = `Could not log out: ${error.message}`;
                dispatch(PlainActions.Actions.authFailure(errMsg));
                this.callbacks.onError(errMsg);
            }
            return this.logoutActionIntent();
        };
    }

    public checkRole(role: string) {
        const validateInput = (inputRole: string, account: object | null) => {
            ow(inputRole, "role", ow.string.nonEmpty);
            if (!account) throw new Error("Cannot get role before authentication");
        };

        const doCheckRole = async (uid: string) => {
            return await this.rolesAdapter.hasRole(uid, role);
        };

        const doCheckRoleRequest = async (uid: string) => {
            return await this.rolesAdapter.isRoleRequestedByUser(uid, role);
        };

        return async (dispatch: Dispatch, getState: () => ContainingStoreState) => {
            const state = getState();
            try {
                validateInput(role, state.rolesAuth.account);

                const hasRole = await doCheckRole(state.rolesAuth.account!.uid);
                dispatch(PlainActions.Actions.setRoleStatus(role, hasRole));

                if (!hasRole) {
                    const isRequestingRole = await doCheckRoleRequest(state.rolesAuth.account!.uid);
                    dispatch(PlainActions.Actions.setRoleRequestStatus(role, isRequestingRole));
                }
            } catch (error) {
                this.callbacks.onError(`Could not ensure user is registered: ${error.message}`);
            }
            return this.checkRoleActionIntent(role);
        };
    }

    public ensureAccountRegistered(account: Account) {
        const doEnsureRegistered = async (user: Account) => {
            const userExists = await this.rolesAdapter.userExists(user.uid);
            if (!userExists) {
                await this.rolesAdapter.registerUser(user);
            }
        };

        return async (dispatch: Dispatch) => {
            try {
                await doEnsureRegistered(account);
            } catch (error) {
                this.callbacks.onError(`Could not ensure user is registered: ${error.message}`);
            }
            return this.ensureAccountRegisteredActionIntent(account);
        };
    }

    /**
     * actions
     */
    private initializeActionIntent(): EpicActions.InitializeAction {
        return { type: EpicActions.INITIALIZE };
    }

    private logoutActionIntent(): EpicActions.LogoutAction {
        return { type: EpicActions.LOGOUT };
    }

    private checkRoleActionIntent(role: string): EpicActions.CheckRoleAction {
        return { type: EpicActions.CHECK_ROLE, role };
    }

    private ensureAccountRegisteredActionIntent(account: Account): PrivateEpicActions.EnsureAccountRegisteredAction {
        return { type: PrivateEpicActions.ENSURE_ACCOUNT_REGISTERED, account };
    }
}
