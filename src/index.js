import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/Student/HomePage.js';
import HomePage from './components/Student/HomePage.js';
import Test from './components/Student/Test.js';
import JobPage from './components/Student/JobPage.js';
import EmployerPage from './components/Student/EmployerPage.js';
import FavoritePage from './components/Student/FavoritePage.js';
import AccountPage from './components/Student/AccountPage.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />}>
          <Route index element={<Test />} />
        </Route>
        <Route path='job' element={<JobPage />} />
        <Route path='employer' element={<EmployerPage />} />
        <Route path='favorite' element={<FavoritePage />} />
        <Route path='account' element={<AccountPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
