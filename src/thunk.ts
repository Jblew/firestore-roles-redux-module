import { Action, AnyAction, Middleware } from "redux";
import thunk_ from "redux-thunk";

interface ThunkDispatch<S = {}, E = undefined, A extends Action = AnyAction> {
    <T extends A>(action: T): T;
    <R>(asyncAction: ThunkAction<R, S, E, A>): R;
    <R>(asyncAction: ThunkAction<Promise<R>, S, E, A>): Promise<R>;
}

type ThunkAction<R = any, S = {}, E = undefined, A extends Action = AnyAction> = (
    dispatch: ThunkDispatch<S, E, A>,
    getState: () => S,
    extraArgument: E,
) => R;

type ThunkMiddleware<S = {}, A extends Action = AnyAction, E = undefined> = Middleware<{}, S, ThunkDispatch<S, E, A>>;

const thunk: ThunkMiddleware & {
    withExtraArgument<E>(extraArgument: E): ThunkMiddleware<{}, AnyAction, E>;
} = thunk_;

export { ThunkAction, ThunkDispatch, ThunkMiddleware };
export default thunk;
