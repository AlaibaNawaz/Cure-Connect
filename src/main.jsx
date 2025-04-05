
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ToastProvider, ToastViewport } from "./components/ui/toast"

createRoot(document.getElementById("root")).render(
  <>
    <App />
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  </>
);
