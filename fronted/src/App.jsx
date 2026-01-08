import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './App.css';


function App() {
  return (
    <>
      <NavBar />
      <AppRoutes />
      <Footer />
    </>
  )
}


export default App;
