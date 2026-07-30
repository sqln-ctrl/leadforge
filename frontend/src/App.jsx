import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Leads from "./pages/Leads";
import LeadDetail from "./pages/LeadDetail";
import Discovery from "./pages/Discovery";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Leads />} />
        <Route path="/leads/:id" element={<LeadDetail />} />
        <Route path="/discovery" element={<Discovery />} />
        <Route path="/analytics" element={<Analytics />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
