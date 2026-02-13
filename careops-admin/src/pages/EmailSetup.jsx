import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { setupEmail } from "../services/api";

export default function EmailSetup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleConnect = async () => {
    const workspaceId = localStorage.getItem("workspace_id");

    if (!workspaceId) {
      setError("Workspace not found");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await setupEmail({
        workspace_id: Number(workspaceId),
        sender_email: email,
      });

      navigate("/activation");
    } catch (err) {
      setError(err.message || "Email setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Card>
        <Title>Email Setup</Title>

        <Input
          placeholder="clinic@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <Error>{error}</Error>}

        <Button onClick={handleConnect} disabled={loading}>
          {loading ? "Connecting..." : "Connect Email"}
        </Button>
      </Card>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1f2937, #111827);
`;

const Card = styled.div`
  background: white;
  padding: 50px;
  border-radius: 16px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h2`
  text-align: center;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
`;

const Button = styled.button`
  padding: 14px;
  background: #111827;
  color: white;
  border: none;
  border-radius: 10px;
`;

const Error = styled.p`
  color: red;
`;
