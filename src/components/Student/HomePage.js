import Header from './Header.js';
import { Outlet} from "react-router-dom";
import './HomePage.scss';

import * as React from 'react';



const HomePage = () => {

    
    return (
        <>
            <div className="header">
                <Header />
            </div>
            <div className="home-page">
                <Outlet />
            </div>
            <div className="footer">

            </div>
        </>
    );
}
export default HomePage;