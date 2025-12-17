import ScrollToTop from "./Pages/ScrollTop";
import Homepage from "./Pages/HomePage";
import GetStarted from "./Pages/GetStarted";
import Dashboard from "./Pages/Dashboard";
import { Routes, Route } from "react-router-dom";
import Header from "./Pages/Header";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Features from "./Pages/Features";
import Faqs from "./Pages/Faqs";
import Footer from "./Pages/Footer";
import ProtectedRoute from "./Components/ProtectedRoute";
import NotificationContainer from "./Components/ui/Notification";
import { AuthProvider } from "./Context/AuthContext";
import { AppProvider } from "./Context/AppContext";

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <div>
          <Routes>
            {/* Protected dashboard route */}
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Public routes with header/footer */}
            <Route path="/*" element={
              <>
                <Header />
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/faqs" element={<Faqs />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/getStarted" element={<GetStarted />} />
                  {/* <Route path="*" element={<NotFound />} /> */}
                </Routes>
                <Footer />
              </>
            } />
          </Routes>
          
          {/* Global notification container */}
          <NotificationContainer />
        </div>
      </AppProvider>
    </AuthProvider>
  );
}
