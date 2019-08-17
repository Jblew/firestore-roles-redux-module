// tslint:disable no-console
import * as _ from "lodash";
import ow from "ow";
import { Dispatch } from "redux";

import { Account } from "../../Account";
import { AuthAdapter } from "../../adapter/AuthAdapter";
import { RolesAdapter } from "../../adapter/RolesAdapter";
import { Configuration } from "../../Configuration";
import { State } from "../State";

import { EpicActions } from "./EpicActions";
import { PlainActions } from "./PlainActions";
import { PrivateEpicActions } from "./PrivateEpicActions";

export class EpicActionsImpl implements EpicActions, PrivateEpicActions {
    private config: Configuration;
    private rolesAdapter: RolesAdapter;
    private authAdapter: AuthAdapter;

    public constructor(config: Configuration, auth: firebase.auth.Auth, firestore: firebase.firestore.Firestore) {
        this.config = config;
        this.rolesAdapter = new RolesAdapter(config, firestore);
        this.authAdapter = new AuthAdapter(auth);
    }

    public initialize() {
        return (dispatch: Dispatch, getState: () => State) => {
            console.log("initialize action, getState(): ", getState());
            dispatch(PlainActions.Actions.authLoading());

            this.authAdapter.initialize({
                onAuthenticated: user => this.onAuthenticated(dispatch, user),
                onNotAuthenticated: () => dispatch(PlainActions.Actions.authNotAuthenticated()),
                onError: msg => dispatch(PlainActions.Actions.authFailure(msg)),
            });
            return this.initializeActionIntent();
        };
    }

    public logout() {
        return (dispatch: Dispatch) => {
            dispatch(PlainActions.Actions.authLoading());
            (async () => {
                try {
                    await this.authAdapter.signOut();
                    dispatch(PlainActions.Actions.authNotAuthenticated());
                } catch (error) {
                    console.error(error);
                    dispatch(PlainActions.Actions.authFailure(`Could not log out: ${error.message}`));
                }
            })();
            return this.logoutActionIntent();
        };
    }

    public checkRole(role: string) {
        const validateInput = (inputRole: string, account: object | undefined) => {
            ow(inputRole, "role", ow.string.oneOf(_.keys(this.config.roles.roles)));
            if (!account) throw new Error("Cannot get role before authentication");
        };

        const doCheckRole = async (uid: string) => {
            return await this.rolesAdapter.hasRole(uid, role);
        };

        const doCheckRoleRequest = async (uid: string) => {
            return await this.rolesAdapter.isRoleRequestedByUser(uid, role);
        };

        return (dispatch: Dispatch, getState: () => State) => {
            const state = getState();
            (async () => {
                try {
                    validateInput(role, state.account);

                    const hasRole = await doCheckRole(state.account!.uid);
                    dispatch(PlainActions.Actions.setRoleStatus(role, hasRole));

                    if (!hasRole) {
                        const isRequestingRole = await doCheckRoleRequest(state.account!.uid);
                        dispatch(PlainActions.Actions.setRoleRequestStatus(role, isRequestingRole));
                    }
                } catch (error) {
                    this.config.callbacks.onError(`Could not ensure user is registered: ${error.message}`);
                }
            })();
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

        return (dispatch: Dispatch) => {
            (async () => {
                try {
                    await doEnsureRegistered(account);
                } catch (error) {
                    this.config.callbacks.onError(`Could not ensure user is registered: ${error.message}`);
                }
            })();
            return this.ensureAccountRegisteredActionIntent(account);
        };
    }

    private onAuthenticated(dispatch: Dispatch, user: firebase.UserInfo) {
        const account = Account.fromFirebaseUserInfo(user);

        dispatch<any>(this.ensureAccountRegistered(account));
        dispatch(PlainActions.Actions.authSuccess(account));
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
