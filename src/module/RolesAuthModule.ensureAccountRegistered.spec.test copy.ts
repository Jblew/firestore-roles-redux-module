import * as _ from "lodash";

import { AuthState } from "../AuthState";

import { PlainActions } from "./actions/PlainActions";
import { getSampleFirebaseAccount, mock } from "./RolesAuthModule.mocks.test";

describe("RolesAuthModule", () => {
    describe.skip("#ensureAccountRegistered", () => {
        it("Calls rolesAdapter.userExists");
        it("If user does not exist calls rolesAdapter.registerUser");
        it("On error in rolesAdapter.userExists callbacks.onError");
        it("On error in rolesAdapter.registerUser callbacks.onError");
    });
});
