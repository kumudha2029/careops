import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Workspace from "./pages/Workspace";
import EmailSetup from "./pages/EmailSetup";
import Activation from "./pages/Activation";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/email" element={<EmailSetup />} />
        <Route path="/activation" element={<Activation />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
