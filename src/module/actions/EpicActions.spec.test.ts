describe("EpicActions", () => {
    describe("#initialize", () => {
        it("Dispatches authLoading");
        it("Sets auth state to loading");
        it("Calls authAdapter.initialize");

        describe("onAuthenticated", () => {
            it("Dispatches authSuccess");
            it("calls #ensureAccountRegistered");
            it("Sets account");
            it("Sets auth state to authenticated");
            it("Calls callbacks.onAuthenticated");
        });

        describe("onNotAuthenticated", () => {
            it("Dispatches authNotAuthenticated");
            it("Resets account");
            it("Sets auth state to notauthenticated");
            it("Calls callbacks.onNotAuthenticated");
        });

        describe("onError", () => {
            it("Dispatches authFailure");
            it("Does not reset account");
            it("Does not change auth state");
            it("Calls callbacks.onError");
        });
    });

    describe("#logout", () => {
        it("Dispatches authLoading");
        it("Calls authAdapter.signOut()");
        it("After sign out sets auth state to notAuthenticated");
        it("After sign out dispatches authNotAuthenticated");
        it("After sign out error calls callbacks.onError");
        it("After sign out error dispatches authFailure");
    });

    describe("#checkRole", () => {
        it("Fails on invalid role");
        it("Calls rolesAdapter.hasRole");
        it("Sets role key in .roles");
        it("Calls rolesAdapter.isRoleRequestedByUser");
        it("Sets role request key in .roleRequests");

        it("On error in rolesAdapter.hasRole calls callbacks.onError");
        it("On error in rolesAdapter.isRoleRequestedByUser calls callbacks.onError");
    });

    describe("#ensureAccountRegistered", () => {
        it("Calls rolesAdapter.userExists");
        it("If user does not exist calls rolesAdapter.registerUser");
        it("On error in rolesAdapter.userExists callbacks.onError");
        it("On error in rolesAdapter.registerUser callbacks.onError");
    });
});
