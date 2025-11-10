import { Routes, Route } from "react-router-dom";
import MainLanding from "./MainLanding";
 import About from "./aboutPage/about";
  import Contact from "./Contactus";


export default function GenralRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLanding />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
