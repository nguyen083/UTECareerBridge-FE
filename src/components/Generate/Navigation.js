import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import DomainIcon from '@mui/icons-material/Domain';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import React from 'react';
const Navigation = () => {
    const navigate = useNavigate();
    const [value, setValue] = React.useState(0);

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
    return (
        <div className='position-absolute top-100 start-50 translate-middle d-block d-md-none ' style={{ zIndex: '1000', width: "100%"}}>
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