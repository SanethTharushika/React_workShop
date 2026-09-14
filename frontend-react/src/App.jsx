import './App.css'
import HomePage from './pages/homePage'
import LoginPage from './pages/loginPage'
import RegisterPage from './pages/registerPage'
import AdminPage from './pages/adminPage'
import TestPage from './pages/testPage'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google';

//1096830050116-bhcg9vceg4mkod3egkospq5hgclj0jbq.apps.googleusercontent.com

function App() {
  

  return (

    <GoogleOAuthProvider clientId="1096830050116-bhcg9vceg4mkod3egkospq5hgclj0jbq.apps.googleusercontent.com">
    <div className="w-full h-full bg-white">

      <Toaster position="top-right"/>


    <Routes>
      <Route path="/*" element={<HomePage />} />
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/admin/*" element={<AdminPage />} />
      <Route path="/test" element={<TestPage />} />
      
    </Routes> 
    </div>
    </GoogleOAuthProvider>
  )
}

export default App
