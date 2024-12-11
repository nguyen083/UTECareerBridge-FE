import { message } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const responseCode = searchParams.get('vnp_ResponseCode');
    const transactionStatus = searchParams.get('vnp_TransactionStatus');

    if (responseCode === '00' && transactionStatus === '00') {
      navigate('/employer/cart'); 
      
      message.success('Thanh toán thành công!');
    } else {
      navigate('/payment-failed'); // Optional: redirect to a failure page
      message.error('Thanh toán không thành công');
    }
  }, [location, navigate]);

  return null; // This component doesn't render anything
};

export default PaymentReturn;