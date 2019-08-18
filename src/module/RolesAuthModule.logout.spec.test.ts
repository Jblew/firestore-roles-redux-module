import * as _ from "lodash";

import { AuthState } from "../AuthState";

import { PlainActions } from "./actions/PlainActions";
import { expectActionDispatched, expectAuthState, mock } from "./RolesAuthModule.mocks.test";

describe("RolesAuthModule", () => {
    describe("#logout", () => {
        let m: ReturnType<typeof mock>;
        beforeEach(async () => {
            m = mock();
            m.authAdapter.signOut = jest.fn(async () => {
                /* */
            });
        });

        /**
         * Domain language
         */
        const dispatchLogoutInMock = () => m.storeMock.dispatch<any>(m.raModule.actions.logout());
        const dispatchLogoutInStore = () => m.store.dispatch<any>(m.raModule.actions.logout());

        /**
         * Tests
         */
        it("Dispatches authLoading", async () => {
            await dispatchLogoutInMock();
            expect(m.storeMock.getActions()).toContainEqual(PlainActions.Actions.authLoading());
        });

        it("Calls authAdapter.signOut()", async () => {
            await dispatchLogoutInStore();
            expect(m.authAdapter.signOut).toBeCalledTimes(1);
        });

        it("After sign out sets auth state to notAuthenticated", async () => {
            await dispatchLogoutInStore();
            expectAuthState(m, AuthState.NOTAUTHENTICATED);
        });

        it("After successfull sign out dispatches authNotAuthenticated", async () => {
            await dispatchLogoutInMock();
            expectActionDispatched(m, PlainActions.AUTH_NOTAUTHENTICATED);
        });

        describe("Sign out error", () => {
            beforeEach(async () => {
                m.authAdapter.signOut = jest.fn(async () => {
                    throw new Error("Sign out error");
                });
            });

            it("After sign out error calls callbacks.onError", async () => {
                await dispatchLogoutInStore();
                expect(m.callbacks.onError).toBeCalledTimes(1);
            });

            it("After sign out error dispatches authFailure", async () => {
                await dispatchLogoutInMock();
                expectActionDispatched(m, PlainActions.AUTH_FAILURE);
            });
        });
    });
});
