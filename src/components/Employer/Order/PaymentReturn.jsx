import { message } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const PaymentReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const responseCode = searchParams.get('vnp_ResponseCode');
    const transactionStatus = searchParams.get('vnp_TransactionStatus');

    if (responseCode === '00' && transactionStatus === '00') {
      navigate('/employer/cart'); 
      
      message.success(t('employer.orders.paymentSuccess'));
    } else {
      navigate('/payment-failed');
      message.error(t('employer.orders.paymentError'));
    }
  }, [location, navigate, t]);

  return null;
};

export default PaymentReturn;