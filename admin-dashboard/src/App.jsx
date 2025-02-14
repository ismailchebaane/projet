import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SecondPage from "./pages/SecondPage";
import LoginForm from "./components/auth/LoginForm";
import EquipmentsDashboard from "./components/equipment/EquipmentsDashboard";
import EquipmentForm from "./components/equipment/EquipmentForm";
import EquipmentEdit from "./components/equipment/EquipmentEdit";
import EquipmentDetails from "./components/equipment/EquipmentDetails";
import EmployeesDashboard from "./components/employee/EmployeesDashboard";
import EmployeeForm from "./components/employee/EmployeeForm";
import EmployeeProfile from "./components/employee/EmployeeProfile";
import Navbar from "./components/common/Navbar";
import NotFoundPage from  "./components/common/NotFoundPage";
function App() {
  return (
    <Router>
      <Navbar />
    
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/second" element={<SecondPage />} />
        <Route path="/equipments" element={<EquipmentsDashboard />} />
        <Route path="/equipment/add" element={<EquipmentForm />} />
        <Route path="/equipment/edit/:id" element={<EquipmentEdit />} />
        <Route path="/equipment/:id" element={<EquipmentDetails />} />
        <Route path="/employees" element={<EmployeesDashboard />} />
        <Route path="/employee/add" element={<EmployeeForm />} />
        <Route path="/employee/:id" element={<EmployeeProfile />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
