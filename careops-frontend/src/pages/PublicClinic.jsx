import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BASE_URL = "https://careops-ixxy.onrender.com";

export default function PublicClinic() {
  const { workspaceId } = useParams();

  const [clinicName, setClinicName] = useState("Loading...");
  const [form, setForm] = useState({
    patient_name: "",
    phone: "",
    email: "",
    appointment_date: "",
    appointment_time: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/public/clinic/${workspaceId}`)
      .then(res => res.json())
      .then(data => setClinicName(data.clinic_name || "CareOps Clinic"))
      .catch(() => setClinicName("CareOps Clinic"));
  }, [workspaceId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (
      !form.patient_name ||
      !form.phone ||
      !form.email ||
      !form.appointment_date ||
      !form.appointment_time
    ) {
      setError("All fields required");
      return;
    }

    setError("");
    setMessage("");

    const res = await fetch(
      `${BASE_URL}/public/book/${workspaceId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          appointment_time: form.appointment_time + ":00"
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.detail || "Booking failed");
      return;
    }

    setMessage(
      `Appointment booked! Verify using token: ${data.verification_token}`
    );

    setForm({
      patient_name: "",
      phone: "",
      email: "",
      appointment_date: "",
      appointment_time: ""
    });
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>{clinicName}</h1>

      <input
        name="patient_name"
        placeholder="Full Name"
        value={form.patient_name}
        onChange={handleChange}
      />
      <br />

      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
      />
      <br />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <br />

      <input
        type="date"
        name="appointment_date"
        value={form.appointment_date}
        onChange={handleChange}
      />
      <br />

      <input
        type="time"
        name="appointment_time"
        value={form.appointment_time}
        onChange={handleChange}
      />
      <br />

      <button onClick={handleSubmit}>
        Book Appointment
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}
