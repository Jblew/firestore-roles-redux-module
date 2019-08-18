# Firestore-roles Redux module

[![npm](https://img.shields.io/npm/v/firestore-roles-redux-module.svg?style=flat-square)](https://www.npmjs.com/package/firestore-roles-redux-module) [![build](https://travis-ci.com/Jblew/firestore-roles-redux-module.svg?branch=master)](https://travis-ci.com/Jblew/firestore-roles-redux-module) [![Code climate maintainability](https://img.shields.io/codeclimate/maintainability/Jblew/firestore-roles-redux-module?style=flat-square)](https://codeclimate.com/github/Jblew/firestore-roles-redux-module) [![Code coverage](https://img.shields.io/codeclimate/coverage/Jblew/firestore-roles-redux-module?style=flat-square)](https://codeclimate.com/github/Jblew/firestore-roles-redux-module) [![License](https://img.shields.io/github/license/Jblew/firestore-roles-redux-module.svg?style=flat-square)](https://github.com/Jblew/firestore-roles-redux-module/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Redux module for auth using firebase auth and firestore-roles system.

**Companion to [firestore-roles](https://github.com/jblew/firestore-roles) system.**
Redux module for firestore-roles system

## Usage

**1. Install**

```bash
$ npm
$ npm install --save firestore-roles-redux-module

# Install dependencies
$ npm install --save redux-thunk
```

**Requirements**: `redux-thunk` middleware.

**2. Define state types: `State.ts`**

You have to put RolesAuth module under the `rolesAuth` key.

```typescript
import { RolesAuthModule } from "firestore-roles-redux-module";

export interface State {
    rolesAuth: RolesAuthModule.State;
    // ... state of other modules
}
```

**4. Define Actions type: `Actions.ts`**

```typescript
import { RolesAuthModule } from "firestore-roles-redux-module";

import { RootActions } from "./root/RootActions";

export interface Actions {
    rolesAuth: RolesAuthModule.PublicActions;
    // ... actions of other modules
}

export namespace Actions {
    export type Type = RootActions.Type | RolesAuthModule.PublicActionType; // | union type for other actions
}
```

**3. Configure store in `/store/index.ts`**

```typescript
import * as firebase from "firebase/app";
import { RolesAuthModule } from "firestore-roles-redux-module";
import { applyMiddleware, combineReducers, createStore, Reducer } from "redux";
import thunk from "redux-thunk";

import { Actions } from "./Actions";
import { RootActionsImpl } from "./root/RootActionsImpl";
import { State } from "./State";
import { Store } from "./Store";

function configureRolesAuthModule() {
    return RolesAuthModule.getModule<State>(
        {
            roles: firestoreRolesConfiguration,
            callbacks: {
                onAuthenticated: account => ({
                    /* */
                }),
                onNotAuthenticated: () => {
                    /* */
                },
                onError: error => {
                    /* */
                },
            },
        },
        firebase.auth(),
        firebase.firestore(),
    );
}

export function configureStore(): Store {
    const rolesAuthModule = configureRolesAuthModule();

    const rootReducer: Reducer<State, Actions.Type> = combineReducers({
        rolesAuth: rolesAuthModule.reducer,
        // reducers for other modules
    });

    const actions: Actions = {
        rolesAuth: rolesAuthModule.actions,
        // public actions of other modules
    };

    const middleware = applyMiddleware(thunk);
    const store = createStore(rootReducer, {}, middleware);

    return {
        ...store,
        actions,
    };
}
```

**4. Initialize rolesAuth in your initialization logic**

```typescript
// dispatch initialize() thunk action inside your initialization logic
store.dispatch<any>(actions.auth.initialize());
```

**5. Use firebase-auth with redirect flow**

