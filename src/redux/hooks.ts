import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, OverallState } from "./store";

export const useTypedSelector: TypedUseSelectorHook<OverallState> = useSelector;
export const useTypedDispatch: () => AppDispatch = useDispatch;
