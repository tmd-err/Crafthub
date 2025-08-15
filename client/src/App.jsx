import {BrowserRouter as Router , Routes , Route } from "react-router-dom" ;
import Navbar from './assets/Navbar';
import SignUp from './components/Auth/SignUp';
import Login from './components/Auth/Login' ;
import Home from './Pages/Homepage';
import Footer from './assets/Footer';
import Contact from './components/Contact';
import Services from './pages/Services';
import AddService from './components/Service/AddService';
import { ToastContainer } from 'react-toastify';
import Profile from "./components/Profile";
import Reservations from "./Pages/Reservations";
import ArtisanServices from "./components/Service/ArtisanServices";
import About from "./Pages/About";
import Faq from "./Pages/FAQ";
import ArtisanProfile from "./components/ArtisanProfile";
import ServiceDetails from "./components/Service/ServiceDetails";
import ScrollToTop from "./assets/ScrollToTop";
import Chat from "./Pages/Chat";
import ChatContainer from "./components/Chat/ChatContainer";
function App() {
  return (
    <>
      <Router>
      <ScrollToTop/>
      <Navbar/>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path='/'  index element={<Home/>}/>
        <Route path='/auth/sign-up' element={<SignUp/>}/>
        <Route path='/auth/login' element={<Login/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/services' element={<Services/>}/>
        <Route path='/services/service/:id' element={<ServiceDetails/>}/>
        <Route path="/services/artisan/:id" element={<ArtisanServices/>} />
        <Route path='/add-service' element={<AddService/>}/>
        <Route path="/profile/:id" element={<Profile/>}/> 
        <Route path="/reservations" element={<Reservations/>}/> 
        <Route path="/conversations" element={<Chat/>} >
          <Route path=":receiverId" element={<ChatContainer/>} />
        </Route>
        <Route path="/about" element={<About/>} />
        <Route path="/FAQ" element={<Faq/>} />
        <Route path="/profile/artisan/:artisanId" element={<ArtisanProfile/>} />
      </Routes>
      <Footer/>
    </Router>

    </>
  )
}

export default App
