import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  createLead,
  getLeads,
  deleteLead,
  convertLead,
} from "../services/api";

export default function Leads() {
  const workspaceId = localStorage.getItem("workspace_id");

  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    source: "",
  });
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    if (workspaceId) loadLeads();
  }, []);

  const loadLeads = async () => {
    const data = await getLeads(workspaceId);
    setLeads(data);
  };

  const handleAdd = async () => {
    if (!form.name || !form.phone || !form.email) {
      setError("All fields required");
      return;
    }

    await createLead({
      ...form,
      workspace_id: Number(workspaceId),
    });

    setForm({ name: "", phone: "", email: "", source: "" });
    loadLeads();
  };

  const handleDelete = async (id) => {
    setLoadingId(id);
    await deleteLead(id);
    setLoadingId(null);
    loadLeads();
  };

  const handleConvert = async (id) => {
    setLoadingId(id);
    await convertLead(id);
    setLoadingId(null);
    loadLeads();
  };

  return (
    <Container>
      <Section>
        <Title>Leads Management</Title>

        <FormGrid>
          <StyledInput
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          <StyledInput
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />
          <StyledInput
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
          <StyledInput
            placeholder="Source"
            value={form.source}
            onChange={(e) =>
              setForm({ ...form, source: e.target.value })
            }
          />

          <PrimaryButton onClick={handleAdd}>
            Add Lead
          </PrimaryButton>
        </FormGrid>

        {error && <Error>{error}</Error>}

        <TableCard>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.email}</td>
                  <td>
                    <Badge status={lead.status}>
                      {lead.status}
                    </Badge>
                  </td>
                  <td>
                    {lead.status !== "CONVERTED" && (
                      <ConvertBtn
                        onClick={() =>
                          handleConvert(lead.id)
                        }
                      >
                        Convert
                      </ConvertBtn>
                    )}
                    <DeleteBtn
                      onClick={() =>
                        handleDelete(lead.id)
                      }
                    >
                      Delete
                    </DeleteBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableCard>
      </Section>
    </Container>
  );
}

/* ================= STYLES ================= */

const Container = styled.div`
  width: 100%;
`;

const Section = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h2`
  margin-bottom: 30px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  margin-bottom: 30px;
`;

const StyledInput = styled.input`
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #111827;
  }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #111827, #000);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
`;

const TableCard = styled.div`
  background: #f9fafb;
  border-radius: 16px;
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 12px;
    background: #e5e7eb;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
  }
`;

const Badge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: white;
  font-weight: bold;

  background: ${(props) =>
    props.status === "NEW"
      ? "#3b82f6"
      : "#10b981"};
`;

const ConvertBtn = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  margin-right: 8px;
  cursor: pointer;
`;

const DeleteBtn = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
`;

const Error = styled.p`
  color: red;
`;
