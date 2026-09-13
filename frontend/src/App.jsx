import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyEmailSent from "./pages/VerifyEmailSent";
import Leads from "./pages/Leads";
import LeadDetail from "./pages/LeadDetail";
import Discovery from "./pages/Discovery";
import Analytics from "./pages/Analytics";
import Crm from "./pages/Crm";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
     <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-email-sent" element={<VerifyEmailSent />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Leads />} />
        <Route path="leads/:id" element={<LeadDetail />} />
        <Route path="discovery" element={<Discovery />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="crm" element={<Crm />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}
