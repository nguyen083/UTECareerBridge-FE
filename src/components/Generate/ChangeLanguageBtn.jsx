import { Button } from "antd";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setLang } from "../../redux/action/webSlice";

const ChangeLanguageBtn = ()=>{
    const { i18n} = useTranslation();
    const dispatch = useDispatch();
    const changeLanguage = () => {
        if (i18next.language === "en") {
            i18n.changeLanguage("vi");
            dispatch(setLang('vi'));
        } else {
            i18n.changeLanguage("en");
            dispatch(setLang('en'));
        }
    };

    return (
        <Button className="ease-out transform hover:scale-105" size="large" shape="circle" onClick={changeLanguage} type="default">{i18next.language}</Button>

    )
}
export default ChangeLanguageBtn;