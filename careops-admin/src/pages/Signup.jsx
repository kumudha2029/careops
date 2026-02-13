import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { signup } from "../services/api";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await signup({ email });

      // Move to Workspace page after successful signup
      navigate("/workspace");

    } catch (err) {
      console.error("Signup failed:", err);
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Card>
        <Logo>CareOps</Logo>

        <Subtitle>
          Build your unified operations platform
        </Subtitle>

        <InputGroup>
          <Label>Email Address</Label>
          <Input
            type="email"
            placeholder="owner@clinic.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>

        {error && <Error>{error}</Error>}

        <Button onClick={handleSignup} disabled={loading}>
          {loading ? "Creating account..." : "Get Started"}
        </Button>

        <Footer>
          No password required for prototype demo
        </Footer>
      </Card>
    </Wrapper>
  );
}

/* ================= Styled Components ================= */

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1f2937, #111827);
`;

const Card = styled.div`
  background: #ffffff;
  padding: 50px;
  border-radius: 16px;
  width: 380px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const Logo = styled.h1`
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #111827;
  }
`;

const Button = styled.button`
  padding: 14px;
  background: #111827;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: 0.2s ease;

  &:hover {
    background: #000;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Error = styled.p`
  color: red;
  font-size: 13px;
`;

const Footer = styled.p`
  font-size: 12px;
  text-align: center;
  color: #9ca3af;
`;
