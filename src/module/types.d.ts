import { StateType, ActionType } from "typesafe-actions";
import { EpicActions } from "./actions/EpicActions";
import { PrivateEpicActions } from "./actions/PrivateEpicActions";
import { PlainActions } from "./actions/PlainActions";

export type RootAction = EpicActions.Type | PrivateEpicActions.Type | PlainActions.Type;

declare module "typesafe-actions" {
    interface Types {
        RootAction: RootAction;
    }
}
