import { StateType, ActionType, Action } from "typesafe-actions";
import { EpicActions } from "./actions/EpicActions";
import { PrivateEpicActions } from "./actions/PrivateEpicActions";
import { PlainActions } from "./actions/PlainActions";
import { AnyAction, Action as ReduxAction } from "redux";
import { State } from "./State";

export type RootAction = EpicActions.Type | PrivateEpicActions.Type | PlainActions.Type;

declare module "typesafe-actions" {
    interface Types {
        RootAction: RootAction;
    }
}

/*
declare module "r//edux-thunk" {
    export type AsyncThunk<A extends Action> = ThunkAction<Promise<A>, State, {}, A>;
}
*/
