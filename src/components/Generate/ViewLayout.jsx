import BoxContainer from "./BoxContainer";
import { Outlet } from "react-router-dom";
const ViewLayout = () => {
    return (
        <BoxContainer width={"100%"} className="mx-auto" background='#F5F5F5' >
            <div className="w-75 mx-auto">
                <Outlet />
            </div>
        </BoxContainer>
    )
}
export default ViewLayout;