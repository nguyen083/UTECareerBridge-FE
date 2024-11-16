import { LoadingOutlined } from "@ant-design/icons";
import { useEffect } from "react";

const IconLoading = (props) => {
    const { time, loading, setLoading } = props;

    useEffect(() => {
        if (time === 0) {
            setLoading(false);
        } else {
            const timer = setTimeout(() => {
                setLoading(false);
            }, time);
            // Cleanup the timer if the component is unmounted
            return () => clearTimeout(timer);
        }
    }, [time]);
    return (
        <>
            {loading && <LoadingOutlined style={{ fontSize: 24, color: "#00A2E8" }} spin />}
        </>
    );
}
export default IconLoading;