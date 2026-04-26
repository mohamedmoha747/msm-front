import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Treatment from './components/Services';
// import SmileGallery from './components/SmileGallery';
import Equipments from './components/Equipments';
import Doctors from './components/Doctors';
import Testimonials from './components/Testimonials';
import AwardsAndCertifications from './components/AwardsAndCertifications';
import AppointmentForm from './components/AppointmentForm';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './components/Admin';
import TreatmentDetails from './components/TreatmentDetails';
import './App.css';

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Treatment />
      {/* <SmileGallery /> */}
      <Equipments />
      <Doctors />
      <Testimonials />
      <AwardsAndCertifications />
      <AppointmentForm />
      <Contact />
    </>
  );
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return null;
}

function AppContent() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/our-treatments" element={<Treatment />} />
            <Route path="/treatment/:name" element={<TreatmentDetails />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

