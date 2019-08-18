// tslint:disable:ordered-imports
import * as firebase from "firebase/app";

export class AuthAdapter {
    private auth: firebase.auth.Auth;

    public constructor(auth: firebase.auth.Auth) {
        this.auth = auth;
    }

    public initialize(callbacks: AuthAdapter.Callbacks): Promise<void> {
        return new Promise<void>(resolve => {
            this.auth.onAuthStateChanged(
                (user: firebase.UserInfo | null) => {
                    if (user) {
                        callbacks.onAuthenticated(user);
                    } else {
                        callbacks.onNotAuthenticated();
                    }
                    resolve();
                },
                (error: firebase.auth.Error) => {
                    callbacks.onError(error.message);
                    resolve();
                },
            );
        });
    }

    public async signOut() {
        await this.auth.signOut();
    }
}

export namespace AuthAdapter {
    export interface Callbacks {
        onAuthenticated: (account: firebase.UserInfo) => void;
        onError: (msg: string) => void;
        onNotAuthenticated: () => void;
    }
}
