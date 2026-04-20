import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Learn from "./pages/Learn";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import Report from "./pages/Report";
import Analytics from "./pages/Analytics";



export default function App() {
  return (
      <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Learn />} />   {/* default */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<Map />} />
        <Route path="/report" element={<Report />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}