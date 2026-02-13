import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createWorkspace } from "../services/api";

export default function Workspace() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

const handleCreate = async () => {
  console.log("Create button clicked");

  if (!name || !address) {
    setError("All fields are required");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const data = await createWorkspace({
      name,
      address,
      timezone,
    });

    console.log("API Response:", data);

    if (!data || !data.id) {
      console.log("Workspace ID missing in response");
      setError("Workspace ID missing");
      return;
    }

    localStorage.setItem("workspace_id", data.id);

    console.log("Saved ID:", localStorage.getItem("workspace_id"));

    navigate("/email");
  } catch (err) {
    console.log("ERROR:", err);
    setError("Workspace creation failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <Wrapper>
      <Card>
        <Title>Create Workspace</Title>

        <Input
          placeholder="Business Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <Select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        >
          <option value="Asia/Kolkata">Asia/Kolkata</option>
          <option value="UTC">UTC</option>
        </Select>

        {error && <Error>{error}</Error>}

        <Button onClick={handleCreate} disabled={loading}>
          {loading ? "Creating..." : "Continue"}
        </Button>
      </Card>
    </Wrapper>
  );
}

/* Styles unchanged */
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

const Select = styled.select`
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
