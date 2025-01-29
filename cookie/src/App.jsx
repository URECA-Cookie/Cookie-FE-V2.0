import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AppScreen from "./routes/AppScreen";
import GlobalStyle from "./styles/global";
import AddMovie from "../src/pages/admin/AdminMovie";
import AdminLogin from "../src/pages/admin/AdminLogin";
import ScrollToTop from "./components/common/ScrollToTop";
import LoginModal from "./components/common/LoginModal";
import AdminReviewLike from "./pages/admin/AdminReviewLike";
import AdminMatchUp from "./pages/admin/AdminMatchUp";
import AdminBadge from "./pages/admin/AdminBadge";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <>
      <GlobalStyle />
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToTop />
          <LoginModal />
          <Routes>
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/movie" element={<AddMovie />} />
            <Route path="/admin/reviews-likes" element={<AdminReviewLike />} />
            <Route path="/admin/matchup" element={<AdminMatchUp />} />
            <Route path="/admin/badge" element={<AdminBadge />} />
            <Route path="/" element={<AppScreen />} />
            <Route path="*" element={<AppScreen />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </>
  );
}

export default App;
