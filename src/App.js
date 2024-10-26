import './App.scss';
import { Outlet } from "react-router-dom";
import { ConfigProvider } from 'antd';
import Navigation from './components/Generate/Navigation.js';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
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
            contentFontSize: '1rem',
            contentFontSizeLG: '1rem',
            paddingBlock: '0.25rem',
            paddingBlockLG: '0.5rem',
          },
          Input: {
            inputFontSize: '1rem',
            inputFontSizeLG: '1rem',
          },
          Menu: {
            iconMarginInlineEnd: '0.625rem'
          }
        }
      }}>
      <div className="App">
        <Outlet />
      </div>
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
    </ConfigProvider>
  );
}

export default App;
