import BoxContainer from "./BoxContainer";
import { Outlet } from "react-router-dom";
const ViewLayout = ({ width = "90%" }) => {
    return (
        <BoxContainer width={"100%"} className="mx-auto" background='#F5F5F5' >
            <div className="mx-auto" style={{ width }}>
                <Outlet />
            </div>
        </BoxContainer>
    )
}
export default ViewLayout;