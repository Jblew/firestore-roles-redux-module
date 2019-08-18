import * as _ from "lodash";

import { AuthState } from "../AuthState";

import { PlainActions } from "./actions/PlainActions";
import { getSampleFirebaseAccount, mock } from "./RolesAuthModule.mocks.test";

describe("RolesAuthModule", () => {
    describe.skip("#logout", () => {
        it("Dispatches authLoading");
        it("Calls authAdapter.signOut()");
        it("After sign out sets auth state to notAuthenticated");
        it("After sign out dispatches authNotAuthenticated");
        it("After sign out error calls callbacks.onError");
        it("After sign out error dispatches authFailure");
    });
});
