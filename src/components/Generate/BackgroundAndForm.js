import { Outlet } from "react-router-dom";
const BackgroundAndForm = () => {
    return (
        <div className="d-flex">
            <div className='col-lg-4 sticky-top' style={{ height: "100vh", backgroundColor: "#ADADAD" }}>
            </div>
            <div className='col-lg-8 col-12' >
                <Outlet />
            </div>
        </div>
    );
}
export default BackgroundAndForm;