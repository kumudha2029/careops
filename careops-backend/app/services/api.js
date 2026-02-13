import { useState } from "react";
import Signup from "./pages/Signup";
import Workspace from "./pages/Workspace";
import EmailSetup from "./pages/EmailSetup";
import Activation from "./pages/Activation";

function App() {
  const [step, setStep] = useState("signup");
  const [user, setUser] = useState(null);
  const [workspace, setWorkspace] = useState(null);

  if (step === "signup") {
    return (
      <Signup
        onSuccess={(data) => {
          setUser(data);
          setStep("workspace");   // ✅ GO TO WORKSPACE
        }}
      />
    );
  }

  if (step === "workspace") {
    return (
      <Workspace
        user={user}
        onSuccess={(data) => {
          setWorkspace(data);
          setStep("email");       // ✅ THEN EMAIL
        }}
      />
    );
  }

  if (step === "email") {
    return (
      <EmailSetup
        workspace={workspace}
        onSuccess={() => setStep("activation")}
      />
    );
  }

  if (step === "activation") {
    return <Activation workspace={workspace} />;
  }

  return null;
}

export default App;
