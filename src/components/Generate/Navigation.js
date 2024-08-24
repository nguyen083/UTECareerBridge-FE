import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import DomainIcon from '@mui/icons-material/Domain';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Navigation.scss';
const Navigation = () => {
    const [scrollDirection, setScrollDirection] = useState(null);
    const [show, setShow] = useState(true);
    const navigate = useNavigate();
    const [value, setValue] = useState(0);

    const handleClickNavigate = (newValue) => {
        console.log(`handleClickNavigate: ${value} => ${newValue}`);
        setValue(newValue);
        switch (newValue) {
            case 0:
                navigate('/home');
                break;
            case 1:
                navigate('job');
                break;
            case 2:
                navigate('employer');
                break;
            case 3:
                navigate('favorite');
                break;
            case 4:
                navigate('account');
                break;
            default:
                navigate('/');
                break;
        }
    }
    useEffect(() => {
        let lastScrollY = window.pageYOffset;

        const handleScroll = () => {
            const currentScrollY = window.pageYOffset;

            if (currentScrollY > lastScrollY) {
                setScrollDirection('down');
                console.log('down');
                setShow(false);
            } else if (currentScrollY < lastScrollY) {
                setScrollDirection('up');
                console.log('up');
                setShow(true);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <div className={`navigation d-block d-md-none`} style={{ zIndex: '90', width: "100%", bottom: `${show? '-29px':'-100px'}`}}>
            <BottomNavigation showLabels value={value} onChange={(event, newValue) => { handleClickNavigate(newValue); }}>
                <BottomNavigationAction icon={<HomeIcon />} />
                <BottomNavigationAction icon={<WorkIcon />} />
                <BottomNavigationAction icon={<DomainIcon />} />
                <BottomNavigationAction icon={<FavoriteIcon />} />
                <BottomNavigationAction icon={<PersonIcon />} />
            </BottomNavigation>

        </div>
    );
}
export default Navigation;