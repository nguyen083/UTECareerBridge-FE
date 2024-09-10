import { Outlet } from "react-router-dom";

const EmployerPage = () => {
    return (
        <div className="d-flex">
            <div className='col-lg-4 sticky-top' style={{ height: "100vh", backgroundColor: "#ADADAD" }}>
            </div>
            <div className='col-lg-8' >
            <Outlet />
            </div>
        </div>
    );
};
export default EmployerPage;