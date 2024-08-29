import './App.scss';
import { Outlet } from "react-router-dom";
import Navigation from './components/Generate/Navigation.js';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <div className="App">
        <Outlet/>
      </div>
      <Navigation/>
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
    </>
  );
}

export default App;
