import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AppScreen from "./routes/AppScreen";
import AddMovie from "../src/pages/admin/AdminMovie";
import AdminLogin from "../src/pages/admin/AdminLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/movie" element={<AddMovie />} />
        <Route path="/" element={<AppScreen />} />
        <Route path="*" element={<AppScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
