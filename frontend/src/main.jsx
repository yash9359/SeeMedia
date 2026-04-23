import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { Toaster } from 'react-hot-toast';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#111827',
            color: '#f9fafb',
            border: '1px solid #374151',
          },
          success: {
            style: {
              background: '#052e16',
              color: '#dcfce7',
              border: '1px solid #166534',
            },
          },
          error: {
            style: {
              background: '#450a0a',
              color: '#fee2e2',
              border: '1px solid #991b1b',
            },
          },
        }}
      />
      <App   />
    </Provider>
  </StrictMode>
)
