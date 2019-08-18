import * as _ from "lodash";

import { PlainActions } from "./actions/PlainActions";
import { expectActionDispatched, mock } from "./RolesAuthModule.mocks.test";

describe("RolesAuthModule", () => {
    describe("#checkRole", () => {
        const sampleAccountUid = `${Math.random()}`;
        const role = "admin";
        let m: ReturnType<typeof mock>;
        beforeEach(async () => {
            m = mock({ rolesAuth: { account: { uid: sampleAccountUid } } });
            m.rolesAdapter.hasRole = jest.fn(async (uid: string, roleName: string) => true);
            m.rolesAdapter.isRoleRequestedByUser = jest.fn(async (uid: string, roleName: string) => true);
        });

        /**
         * Domain language
         */
        const dispatchCheckRoleInMock = () => m.storeMock.dispatch<any>(m.raModule.actions.checkRole(role));
        const dispatchCheckRoleInStore = () => m.store.dispatch<any>(m.raModule.actions.checkRole(role));

        /**
         * Tests
         */
        /*it("Dispatches setRoleStatus action", async () => {
            await dispatchCheckRoleInMock();
            expectActionDispatched(m, PlainActions.SET_ROLE_STATUS);
        });

        it("Dispatches setRoleRequestStatus action", async () => {
            await dispatchCheckRoleInMock();
            expectActionDispatched(m, PlainActions.SET_ROLE_REQUEST_STATUS);
        });*/

        it("Calls rolesAdapter.hasRole", async () => {
            await dispatchCheckRoleInStore();
            expect(m.rolesAdapter.hasRole).toBeCalledTimes(1);
            expect(m.rolesAdapter.hasRole).toBeCalledWith(sampleAccountUid, role);
        });

        it("Sets role key in .roles", async () => {
            await dispatchCheckRoleInStore();
            expect(m.store.getState().rolesAuth.roles[role]).toEqual(true);
        });

        [true, false].forEach(hasRole =>
            describe("hasRole=" + hasRole, () => {
                beforeEach(() => {
                    m.rolesAdapter.hasRole = jest.fn(async (uid: string, roleName: string) => hasRole);
                });

                it(
                    (hasRole ? "Does not call" : "Calls") +
                        " rolesAdapter.isRoleRequestedByUser when hasRole = " +
                        hasRole,
                    async () => {
                        await dispatchCheckRoleInStore();

                        expect(m.rolesAdapter.isRoleRequestedByUser).toBeCalledTimes(hasRole ? 0 : 1);
                        if (!hasRole) {
                            expect(m.rolesAdapter.isRoleRequestedByUser).toBeCalledWith(sampleAccountUid, role);
                        }
                    },
                );

                it(
                    (hasRole ? "Does not set" : "Sets") +
                        " role request key in .roleRequests when hasRole = " +
                        hasRole,
                    async () => {
                        await dispatchCheckRoleInStore();
                        if (!hasRole) {
                            expect(m.store.getState().rolesAuth.roleRequests[role]).toEqual(true);
                        } else {
                            expect(m.store.getState().rolesAuth.roleRequests).not.toHaveProperty(role);
                        }
                    },
                );
            }),
        );

        ["hasRole", "isRoleRequestedByUser"].forEach(method =>
            it(`On error in rolesAdapter.${method} calls callbacks.onError`, async () => {
                m.rolesAdapter.hasRole = jest.fn(async (uid: string, roleName: string) => false);
                (m.rolesAdapter as any)[method] = jest.fn((uid: string, roleName: string) => {
                    throw new Error("Sample error");
                });
                await dispatchCheckRoleInStore();
                expect(m.callbacks.onError).toBeCalledTimes(1);
            }),
        );
    });
});
