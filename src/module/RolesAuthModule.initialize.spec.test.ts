import * as _ from "lodash";

import { AuthState } from "../AuthState";

import { PlainActions } from "./actions/PlainActions";
import { getSampleFirebaseAccount, mock } from "./RolesAuthModule.mocks.test";

describe("RolesAuthModule", () => {
    describe("#initialize", () => {
        let sampleAccount: firebase.UserInfo;
        let m: ReturnType<typeof mock>;
        beforeEach(async () => {
            sampleAccount = getSampleFirebaseAccount();
            m = mock();
            m.authAdapter.initialize = jest.fn();
        });

        /**
         * Domain lang
         */
        const dispatchInitializeInMock = () => m.storeMock.dispatch<any>(m.raModule.actions.initialize());
        const dispatchInitializeInStore = () => m.store.dispatch<any>(m.raModule.actions.initialize());

        const expectAuthState = (state: AuthState) => expect(m.store.getState().rolesAuth.state).toEqual(state);
        const expectActionDispatched = (actionType: string) =>
            expect(m.storeMock.getActions().map(a => a.type)).toContainEqual(actionType);

        const testStorePropertyReset = async (propertyPath: string, initialValue: boolean) => {
            m = mock(_.set({}, propertyPath, initialValue));
            m.authAdapter.initialize = async callbacks => callbacks.onNotAuthenticated();
            expect(_.get(m.store.getState(), propertyPath)).toEqual(true);
            await dispatchInitializeInStore();
            expect(_.get(m.store.getState(), propertyPath, { doesntExist: true })).toEqual({ doesntExist: true });
        };

        /**
         * Tests
         */
        describe("before callbacks", () => {
            it("Dispatches authLoading", async () => {
                await dispatchInitializeInMock();
                expect(m.storeMock.getActions()).toContainEqual(PlainActions.Actions.authLoading());
            });

            it("Calls authAdapter.initialize", async () => {
                await dispatchInitializeInMock();
                expect(m.authAdapter.initialize).toBeCalledTimes(1);
            });

            it("Sets auth state to loading", async () => {
                await dispatchInitializeInStore();
                expectAuthState(AuthState.LOADING);
            });
        });

        describe("onAuthenticated", () => {
            beforeEach(() => {
                m.authAdapter.initialize = async callbacks => callbacks.onAuthenticated(sampleAccount);
            });

            it("Dispatches authSuccess", async () => {
                await dispatchInitializeInMock();
                expectActionDispatched(PlainActions.AUTH_SUCCESS);
            });

            it("calls #ensureAccountRegistered", async () => {
                m.raModule.actions.ensureAccountRegistered = jest.fn(m.raModule.actions.ensureAccountRegistered);
                await dispatchInitializeInStore();
                expect(m.raModule.actions.ensureAccountRegistered).toBeCalledTimes(1);
            });

            it("Sets account", async () => {
                await dispatchInitializeInStore();
                expect(m.store.getState().rolesAuth.account!.uid).toEqual(sampleAccount.uid);
            });

            it("Sets auth state to authenticated", async () => {
                await dispatchInitializeInStore();
                expectAuthState(AuthState.AUTHENTICATED);
            });

            it("Calls callbacks.onAuthenticated", async () => {
                await dispatchInitializeInMock();
                expect(m.callbacks.onAuthenticated).toBeCalledTimes(1);
            });

            it("Resets roles", async () => testStorePropertyReset("rolesAuth.roles.admin", true));

            it("Resets roleRequests", async () => testStorePropertyReset("rolesAuth.roleRequests.admin", true));
        });

        describe("onNotAuthenticated", () => {
            beforeEach(() => {
                m.authAdapter.initialize = async callbacks => callbacks.onNotAuthenticated();
            });

            it("Dispatches authNotAuthenticated", async () => {
                await dispatchInitializeInMock();
                expectActionDispatched(PlainActions.AUTH_NOTAUTHENTICATED);
            });

            it("Resets account", async () => {
                m = mock({ rolesAuth: { account: { uid: 1 } } });
                m.authAdapter.initialize = async callbacks => callbacks.onNotAuthenticated();
                expect(m.store.getState().rolesAuth.account!.uid).toEqual(1);
                await dispatchInitializeInStore();

                expect(m.store.getState().rolesAuth.account).toBeNull();
            });

            it("Sets auth state to notauthenticated", async () => {
                await dispatchInitializeInStore();
                expectAuthState(AuthState.NOTAUTHENTICATED);
            });

            it("Calls callbacks.onNotAuthenticated", async () => {
                await dispatchInitializeInMock();
                expect(m.callbacks.onNotAuthenticated).toBeCalledTimes(1);
            });

            it("Resets roles", async () => testStorePropertyReset("rolesAuth.roles.admin", true));

            it("Resets roleRequests", async () => testStorePropertyReset("rolesAuth.roleRequests.admin", true));
        });

        describe("onError", () => {
            beforeEach(() => {
                m.authAdapter.initialize = async callbacks => callbacks.onError("Some error");
            });

            it("Dispatches authFailure", async () => {
                await dispatchInitializeInMock();
                expectActionDispatched(PlainActions.AUTH_FAILURE);
            });

            it("Does not reset account", async () => {
                await m.store.dispatch(PlainActions.Actions.authSuccess(sampleAccount));
                expect(m.store.getState().rolesAuth.account!.uid).toEqual(sampleAccount.uid);
                await dispatchInitializeInStore();

                expect(m.store.getState().rolesAuth.account!.uid).toEqual(sampleAccount.uid);
            });

            it("Calls callbacks.onError", async () => {
                await dispatchInitializeInMock();
                expect(m.callbacks.onError).toBeCalledTimes(1);
            });
        });
    });
});
