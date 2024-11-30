import { useDispatch } from "react-redux";
import { setInfor, setInitUser } from "../redux/action/userSlice";
import { setInitWeb } from "../redux/action/webSlice";
import { setInitEmployer } from "../redux/action/employerSlice";
import { setInitNotification } from "../redux/action/notificationSlice";
import { setInitStudent } from "../redux/action/studentSlice";
import { persistor } from "../redux/store";

export const useRedux = () => {
    const dispatch = useDispatch();
    const login = (res) => {
        dispatch(setInfor({ userId: res.data.id, role: res.data.roles.roleName, email: res.data.username }));
    };
    const clearRedux = async () => {
        await persistor.purge();
        dispatch(setInitUser());
        dispatch(setInitWeb());
        dispatch(setInitEmployer());
        dispatch(setInitNotification());
        dispatch(setInitStudent());
    };
    return { login, clearRedux };
}