import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicClinic from "./pages/PublicClinic";
import Verify from "./pages/Verify";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/clinic/1" />} />

        {/* Public website */}
        <Route path="/clinic/:workspaceId" element={<PublicClinic />} />

        {/* Email verification */}
        <Route path="/verify/:token" element={<Verify />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
