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
        },
        components: {
          Form: {
            labelFontSize: '1rem',
          },
          Button: {
            contentFontSize: '1rem',
            contentFontSizeLG: '1rem',
          },
          Input: {
            inputFontSize: '1rem',
            inputFontSizeLG: '1rem',
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
