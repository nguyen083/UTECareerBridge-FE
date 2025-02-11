import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals.jsx';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store.jsx';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <GoogleOAuthProvider clientId="581268031087-0974qi4o664ihsrl0tad8imqfcdb1pkh.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </PersistGate>
  </Provider>
);

reportWebVitals();
