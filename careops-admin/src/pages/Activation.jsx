import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { activateWorkspace } from "../services/api";

export default function Activation() {
  const [loading, setLoading] = useState(false);
  const [activated, setActivated] = useState(false);

  const navigate = useNavigate();

  const handleActivate = async () => {
    const workspaceId = localStorage.getItem("workspace_id");

    if (!workspaceId) {
      alert("Workspace not found");
      return;
    }

    try {
      setLoading(true);
      await activateWorkspace(workspaceId);
      setActivated(true);
    } catch (err) {
      console.error("Activation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <Wrapper>
      <Card>
        <Title>
          {activated ? "Workspace Activated 🎉" : "Ready to Go 🚀"}
        </Title>

        <Subtitle>
          {activated
            ? "Your workspace is now live and fully operational."
            : "Your system is configured. Activate your workspace."}
        </Subtitle>

        {!activated && (
          <Button onClick={handleActivate} disabled={loading}>
            {loading ? "Activating..." : "Activate Workspace"}
          </Button>
        )}

        {activated && (
          <SuccessButton onClick={goToDashboard}>
            Go To Dashboard
          </SuccessButton>
        )}
      </Card>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f172a, #1e293b);
`;

const Card = styled.div`
  background: #ffffff;
  padding: 60px;
  border-radius: 20px;
  width: 450px;
  text-align: center;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 20px 0 30px;
  font-size: 15px;
  color: #64748b;
`;

const Button = styled.button`
  padding: 14px 28px;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: #000;
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

const SuccessButton = styled.button`
  margin-top: 20px;
  padding: 14px 28px;
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
`;


