import './App.scss';
import { Outlet } from "react-router-dom";
import { ConfigProvider, Spin } from 'antd';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from 'react-redux';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1E4F94",
          colorPrimaryHover: "#4478c0",
          fontFamily: "'Inter', sans-serif",
          inputFontSize: '1rem',
          //inputFontSizeLG: '1rem',
        },
        components: {

          Form: {
            labelFontSize: '1rem',
            itemMarginBottom: '1.5rem',
            labelColonMarginInlineEnd: '0.5rem',
            labelHeight: '0.5rem',
            labelColonMarginInlineStart: '0.125rem',
            verticalLabelPadding: '0 0 0rem'
          },
          Button: {
            // contentFontSize: '1rem',
            // contentFontSizeLG: '1rem',
            // paddingBlock: '0.25rem',
            // paddingBlockLG: '0.5rem',
          },
          Menu: {
            iconMarginInlineEnd: '0.625rem'
          }
        }
      }}>
      <Spin style={{ maxHeight: "100vh", height: "100%" }} size='large' spinning={useSelector(state => state.web.loading)}>
        <Outlet />
      </Spin>
      {/* <Navigation/> */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ConfigProvider >
  );
}

export default App;
