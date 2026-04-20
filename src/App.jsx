import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import Map from "./pages/Map";
import Report from "./pages/Report";
import Analytics from "./pages/Analytics";
import { ReportProvider } from "./context/ReportContext";


export default function App() {
  return (
    <ReportProvider>
    <AuthProvider>
      <BrowserRouter>

        <Navbar />
          <Routes>
            <Route path="/" element={<Learn />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/map" element={<Map />} /> */}
            <Route path="/report" element={<Report />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>

      </BrowserRouter>
    </AuthProvider>
    </ReportProvider>
  );
}