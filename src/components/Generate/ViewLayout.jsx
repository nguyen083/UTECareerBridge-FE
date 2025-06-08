import BoxContainer from "./BoxContainer";
import { Outlet } from "react-router-dom";
const ViewLayout = ({ width = "90%", className = "" }) => {
  return (
    <BoxContainer
      padding="1rem"
      width={"100%"}
      className="mx-auto"
      background="#F5F5F5"
    >
      <div className={`mx-auto ${className}`} style={{ width }}>
        <Outlet />
      </div>
    </BoxContainer>
  );
};
export default ViewLayout;
