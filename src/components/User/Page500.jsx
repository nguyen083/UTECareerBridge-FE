import React, { useEffect } from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { stop } from '../../redux/action/webSlice';
const Page500 = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(stop());
    }, []);
    return (
        <Result
            status="500"
            title="500"
            subTitle="Sorry, something went wrong."
            extra={<Button type="primary" onClick={() => navigate('/home')}>Back Home</Button>}
        />
    );
}
export default Page500;