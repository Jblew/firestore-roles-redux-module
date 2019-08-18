import * as _ from "lodash";

import { AuthState } from "../AuthState";

import { PlainActions } from "./actions/PlainActions";
import { getSampleFirebaseAccount, mock } from "./RolesAuthModule.mocks.test";

describe("RolesAuthModule", () => {
    describe.skip("#checkRole", () => {
        it("Fails on invalid role");
        it("Calls rolesAdapter.hasRole");
        it("Sets role key in .roles");
        it("Calls rolesAdapter.isRoleRequestedByUser");
        it("Sets role request key in .roleRequests");

        it("On error in rolesAdapter.hasRole calls callbacks.onError");
        it("On error in rolesAdapter.isRoleRequestedByUser calls callbacks.onError");
    });
});
