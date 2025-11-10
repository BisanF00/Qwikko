import { Routes, Route } from "react-router-dom";
import MainLanding from "./MainLanding";
import About from "./aboutPage/about";
import Contact from "./Contactus";
import AboutPage from "./aboutPage/about";
import ContactUs from "../customer/customer/pages/ContactUs";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";


export default function GenralRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLanding />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
    </Routes>
  );
}
