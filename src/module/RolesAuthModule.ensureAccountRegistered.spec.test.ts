import { AccountRecord } from "firestore-roles";
import * as _ from "lodash";

import { AuthState } from "../AuthState";

import { PlainActions } from "./actions/PlainActions";
import { getSampleFirebaseAccount, mock } from "./RolesAuthModule.mocks.test";

describe("RolesAuthModule", () => {
    describe("#ensureAccountRegistered", () => {
        let m: ReturnType<typeof mock>;
        beforeEach(async () => {
            m = mock();
            m.rolesAdapter.userExists = jest.fn(async (uid: string) => true);
            m.rolesAdapter.registerUser = jest.fn();
        });

        /**
         * Domain language
         */
        const dispatchEnsureAccountRegisteredInStore = () =>
            m.store.dispatch<any>(m.raModule.actions.ensureAccountRegistered(m.sampleAccount));

        const setUserExistence = (exists: boolean) =>
            (m.rolesAdapter.userExists = jest.fn(async (uid: string) => exists));

        it("Calls rolesAdapter.userExists", async () => {
            setUserExistence(true);
            await dispatchEnsureAccountRegisteredInStore();
            expect(m.rolesAdapter.userExists).toBeCalledTimes(1);
            expect(m.rolesAdapter.userExists).toBeCalledWith(m.sampleAccount.uid);
        });

        it("If user does not exist calls rolesAdapter.registerUser", async () => {
            setUserExistence(false);
            await dispatchEnsureAccountRegisteredInStore();
            expect(m.rolesAdapter.registerUser).toBeCalledTimes(1);
            expect(m.rolesAdapter.registerUser).toBeCalledWith(AccountRecord.fromFirebaseUserInfo(m.sampleAccount));
        });

        it("On error in rolesAdapter.userExists callbacks.onError", async () => {
            const errMsg = `err_${Math.random()}`;
            m.rolesAdapter.userExists = jest.fn(async (uid: string) => {
                throw new Error(errMsg);
            });
            await dispatchEnsureAccountRegisteredInStore();
            expect(m.callbacks.onError).toBeCalledTimes(1);
            expect((m.callbacks.onError as jest.Mock).mock.calls[0][0]).toContain(errMsg);
        });

        it("On error in rolesAdapter.registerUser callbacks.onError", async () => {
            const errMsg = `err_${Math.random()}`;
            setUserExistence(false);
            m.rolesAdapter.registerUser = jest.fn(async (account: AccountRecord) => {
                throw new Error(errMsg);
            });
            await dispatchEnsureAccountRegisteredInStore();
            expect(m.callbacks.onError).toBeCalledTimes(1);
            expect((m.callbacks.onError as jest.Mock).mock.calls[0][0]).toContain(errMsg);
        });
    });
});
