import './App.scss';
import { Outlet } from "react-router-dom";
import Navigation from './components/Generate/Navigation.js';


const App = () => {
  return (
    <>
      <div className="App">
        <Outlet/>
      </div>
      <Navigation/>
    </>
  );
}

export default App;
