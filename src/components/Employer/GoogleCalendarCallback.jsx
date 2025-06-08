import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import oauth from "../../services/api/oauth";

const GoogleCalendarCallback = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");
    const state = queryParams.get("state");

    useEffect(() => {
        oauth.getGoogleCalendar({ code, state }).then((res) => {
            if (res.status === "OK") {
                window.close();
            }
        }).catch((err) => {
            console.error(err);
        });
    }, []);
    return null;
};

export default GoogleCalendarCallback;
