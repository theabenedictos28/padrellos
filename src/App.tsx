import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import OperationsDashboard from "./pages/operations/dashboard";
import AllProjects from "./pages/operations/allprojects";
import PurchaseRequests from "./pages/operations/purchaserequests";
import PurchaseOrders from "./pages/operations/purchaseorders";
import DeliveryReports from "./pages/operations/deliveryreports";
import Reports from "./pages/operations/reports"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />  {/* ← add this */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<OperationsDashboard />} />
        <Route path="/projects" element={<AllProjects />} />
        <Route path="/purchase-requests" element={<PurchaseRequests />} /> 
        <Route path="/purchase-orders" element={<PurchaseOrders />} />
        <Route path="/delivery-reports" element={<DeliveryReports />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;