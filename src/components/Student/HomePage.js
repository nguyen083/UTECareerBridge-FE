import Header from './Header.js';
import { Outlet } from "react-router-dom";
const HomePage = () => {
    return (
        <>
        <div className="header">
            <Header/>
        </div>
        <div className="home-page">
            <Outlet/>
        </div>
        <div className="footer">

        </div>
        </>
    );
}
export default HomePage;