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
        <div className='border border-text-color rounded-full cursor-pointer select-none shadow-md hover:scale-105 transition-transform duration-150 ease-in-out'>
        <div onClick={changeLanguage} className="w-9 h-9 bg-text-color rounded-full capitalize !font-bold text-white flex items-center justify-center border border-white">{i18next.language}</div>
    </div>
    )
}
export default ChangeLanguageBtn;