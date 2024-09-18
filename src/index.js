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
import EmployerPage from './components/Employer/EmployerPage.js';
import FavoritePage from './components/Student/FavoritePage.js';
import AccountPage from './components/Student/AccountPage.js';
import RegisterPage from './components/Student/RegisterPage.js';
import LoginPage from './components/Employer/LoginPage.js';
import EmployerRegister from './components/Employer/EmployerRegister.js';
import ForgotPassword from './components/Employer/ForgotPassword.js';
import ChangePassword from './components/Employer/ChangePassword.js';
import BackgroundAndForm from './components/Generate/BackgroundAndForm.js';
import EmployerLayout from './components/Employer/EmployerLayout.js';

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

        <Route path='employer' element={<EmployerPage />}>
          <Route path='register' element={<BackgroundAndForm />}>
            <Route index element={<EmployerRegister />} />
          </Route>
          <Route index element={<EmployerLayout />} />
        </Route>

        {/* <Route path='user' element={<EmployerPage />}> */}
        <Route path='forgot-password' element={<BackgroundAndForm />}>
          <Route index element={<ForgotPassword />} />
        </Route>
        <Route path='reset-password' element={<BackgroundAndForm />} >
          <Route index element={<ChangePassword />} />
        </Route>
        {/* </Route> */}

        <Route path='login' element={<LoginPage />} />
        <Route path='favorite' element={<FavoritePage />} />
        <Route path='account' element={<AccountPage />} />
        <Route path='register' element={<RegisterPage />} />

      </Route>
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
