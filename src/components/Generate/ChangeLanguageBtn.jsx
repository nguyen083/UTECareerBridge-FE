import { Button } from "antd";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

const ChangeLanguageBtn = ()=>{
    const { i18n} = useTranslation();
    const changeLanguage = () => {
        if (i18next.language === "en") {
            i18n.changeLanguage("vi");
            localStorage.setItem('lang', 'vi');
        } else {
            i18n.changeLanguage("en");
            localStorage.setItem('lang', 'en');
        }
    };

    return (
        <Button className="hover:scale-105 transform ease-out" size="large" shape="circle" onClick={changeLanguage} type="default">{i18next.language}</Button>

    )
}
export default ChangeLanguageBtn;