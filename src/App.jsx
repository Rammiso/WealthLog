import ScrollToTop from "./Pages/ScrollTop";
import Homepage from "./Pages/HomePage";
import GetStarted from "./Pages/GetStarted";
import { Routes, Route, NavLink } from "react-router-dom";
import Header from "./Pages/Header";
import Login from "./Pages/Login";
import Features from "./Pages/Features";
import Faqs from "./Pages/Faqs";
import Footer from "./Pages/Footer";
export default function App() {
  return (
    <div>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/getStarted" element={<GetStarted />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
      <Footer />
    </div>
  );
}
