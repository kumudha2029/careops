import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000";

export default function Verify() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    fetch(`${BASE_URL}/public/verify/${token}`)
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, [token]);

  return (
    <div style={{ padding: 50, textAlign: "center" }}>
      <h1>{message}</h1>
    </div>
  );
}
