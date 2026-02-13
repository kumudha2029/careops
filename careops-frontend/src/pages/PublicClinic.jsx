import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const BASE_URL = "https://careops-ixxy.onrender.com";

export default function PublicClinic() {
  const { workspaceId } = useParams();
  const formRef = useRef(null);

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!workspaceId) return;

    fetch(`${BASE_URL}/public/clinic/${workspaceId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.clinic_name) {
          setClinicName(data.clinic_name);
          document.title = data.clinic_name;
        } else {
          setClinicName("CareOps Clinic");
        }
      })
      .catch(() => {
        setClinicName("CareOps Clinic");
      });
  }, [workspaceId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!workspaceId) {
      setError("Invalid clinic link");
      return;
    }

    if (
      !form.patient_name ||
      !form.phone ||
      !form.email ||
      !form.appointment_date ||
      !form.appointment_time
    ) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
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
        setError(typeof data.detail === "string" ? data.detail : "Booking failed");
        return;
      }

      setMessage("Appointment booked successfully!");
      setForm({
        patient_name: "",
        phone: "",
        email: "",
        appointment_date: "",
        appointment_time: ""
      });

    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Wrapper>

      {/* ================= HERO ================= */}

      <Hero>
        <HeroContainer>

          <HeroLeft>
            <Badge>Trusted Healthcare Platform</Badge>

            <HeroTitle>Care Plus</HeroTitle>

            <HeroSubtitle>
              Modern diagnostics. Experienced specialists.
              Compassionate care designed around you.
            </HeroSubtitle>

            <HeroButtons>
              <PrimaryButton onClick={scrollToForm}>
                Book Appointment
              </PrimaryButton>
              <SecondaryButton>
                Call Now
              </SecondaryButton>
            </HeroButtons>

            <FeatureList>
              <FeatureItem>✔ Experienced Specialists</FeatureItem>
              <FeatureItem>✔ Advanced Equipment</FeatureItem>
              <FeatureItem>✔ Same-Day Appointments</FeatureItem>
            </FeatureList>

            <Stats>
              <StatBox>
                <h3>10K+</h3>
                <p>Patients Served</p>
              </StatBox>
              <StatBox>
                <h3>15+</h3>
                <p>Doctors</p>
              </StatBox>
              <StatBox>
                <h3>4.9★</h3>
                <p>Rating</p>
              </StatBox>
            </Stats>

          </HeroLeft>

          <HeroRight>
            <HeroImage
              src="/patient_background.jpg"
              alt="Clinic"
            />
          </HeroRight>

        </HeroContainer>
      </Hero>

      {/* ================= BOOKING ================= */}

      <Section ref={formRef}>
        <FormCard>
          <FormTitle>
            Book Appointment at {clinicName}
          </FormTitle>

          <Input name="patient_name" placeholder="Full Name" value={form.patient_name} onChange={handleChange} />
          <Input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
          <Input name="email" placeholder="Email Address" value={form.email} onChange={handleChange} />
          <Input type="date" name="appointment_date" value={form.appointment_date} onChange={handleChange} />
          <Input type="time" name="appointment_time" value={form.appointment_time} onChange={handleChange} />

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Booking..." : "Confirm Appointment"}
          </Button>

          {error && <Error>{error}</Error>}
          {message && <Success>{message}</Success>}
        </FormCard>
      </Section>

      {/* ================= FOOTER ================= */}

      <Footer>
        <FooterTitle>{clinicName}</FooterTitle>
        <FooterText>📍 123 Health Street, Chennai</FooterText>
        <FooterText>🕒 Mon–Sat: 9AM – 6PM</FooterText>
        <FooterText>📞 +91 98765</FooterText>
      </Footer>

    </Wrapper>
  );
}

/* ================= STYLES ================= */

const Wrapper = styled.div`
  font-family: 'Inter', sans-serif;
  background: #f8fafc;
`;

const Hero = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a, #1e3a8a);
  display: flex;
  align-items: center;
  padding: 80px 20px;
  color: white;
`;

const HeroContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeroLeft = styled.div`
  flex: 1;
`;

const HeroRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(59,130,246,0.4), transparent);
    filter: blur(120px);
    z-index: 0;
  }

  img {
    position: relative;
    z-index: 1;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  max-width: 600px;
  height: 600px;
  object-fit: cover;
  border-radius: 30px;
  box-shadow:
    0 50px 100px rgba(0,0,0,0.6),
    0 0 120px rgba(59,130,246,0.5);
  transform: perspective(1000px) rotateY(-6deg);
  transition: 0.4s ease;

  &:hover {
    transform: perspective(1000px) rotateY(0deg) scale(1.02);
  }
`;

const Badge = styled.div`
  display: inline-block;
  padding: 6px 14px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50px;
  font-size: 13px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
`;

const HeroTitle = styled.h1`
  font-size: 54px;
  font-weight: 800;
  line-height: 1.1;
`;

const HeroSubtitle = styled.p`
  margin-top: 20px;
  font-size: 18px;
  opacity: 0.9;
  max-width: 500px;
`;

const HeroButtons = styled.div`
  margin-top: 30px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  padding: 14px 32px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border: none;
  color: white;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
  }
`;

const SecondaryButton = styled.button`
  padding: 14px 32px;
  background: transparent;
  border: 2px solid rgba(255,255,255,0.6);
  color: white;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background: rgba(255,255,255,0.1);
  }
`;

const FeatureList = styled.div`
  margin-top: 30px;
`;

const FeatureItem = styled.p`
  margin: 8px 0;
  font-size: 15px;
  opacity: 0.9;
`;

const Stats = styled.div`
  margin-top: 40px;
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
`;

const StatBox = styled.div`
  h3 {
    font-size: 30px;
    margin: 0;
    font-weight: 700;
  }

  p {
    margin: 5px 0 0;
    font-size: 14px;
    opacity: 0.8;
  }
`;

const Section = styled.div`
  padding: 100px 20px;
  display: flex;
  justify-content: center;
`;

const FormCard = styled.div`
  background: white;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin-top: 15px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const Button = styled.button`
  margin-top: 20px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  border: none;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
`;

const Success = styled.p`
  margin-top: 20px;
  color: #16a34a;
  text-align: center;
`;

const Error = styled.p`
  margin-top: 20px;
  color: #dc2626;
  text-align: center;
`;

const Footer = styled.div`
  background: #0f172a;
  color: #cbd5e1;
  padding: 60px 20px;
  text-align: center;
`;

const FooterTitle = styled.h3`
  color: white;
  margin-bottom: 10px;
`;

const FooterText = styled.p`
  margin: 5px 0;
`;  

