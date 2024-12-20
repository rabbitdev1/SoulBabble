
import { useSelector } from "react-redux";
import { RootState } from "../../../store/reducers";

export const getDarkModePreference = () => {
    const darkModePreference = useSelector(
        (state: RootState) => state.todoReducer.darkMode
    );
    return darkModePreference !== null ? darkModePreference : false;
};
