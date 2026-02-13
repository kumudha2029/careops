import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getBookings,
  updateBookingStatus,
  rescheduleBooking,
  deleteBooking,
} from "../services/api";

export default function Bookings({ workspaceId }) {
  const [bookings, setBookings] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  // Load bookings when workspaceId changes
  useEffect(() => {
    if (workspaceId) {
      loadBookings();
    }
  }, [workspaceId]);

  const loadBookings = async () => {
    try {
      const data = await getBookings(workspaceId);

      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        console.error("Invalid bookings response:", data);
        setBookings([]);
      }
    } catch (err) {
      console.error("Failed to load bookings", err);
      setBookings([]);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      setLoadingId(id);
      await updateBookingStatus(id, { status });
      await loadBookings();
    } catch (err) {
      console.error("Status update failed", err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleReschedule = async (id) => {
    if (!newDate || !newTime) return;

    try {
      setLoadingId(id);

      await rescheduleBooking(id, {
        appointment_date: newDate,
        appointment_time: newTime + ":00",
      });

      setEditingId(null);
      setNewDate("");
      setNewTime("");

      await loadBookings();
    } catch (err) {
      console.error("Reschedule failed", err);
    } finally {
      setLoadingId(null);
    }
  };

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this booking?")) {
    return;
  }

  try {
    await deleteBooking(id);
    await loadBookings();
  } catch (err) {
    console.error("Delete failed", err);
  }
};

  return (
    <Wrapper>
      <Title>Bookings Management</Title>

      {bookings.length === 0 ? (
        <Empty>No bookings found.</Empty>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.patient_name}</td>
                <td>{b.phone}</td>
                <td>{b.appointment_date || "-"}</td>
                <td>
                  {b.appointment_time
                    ? b.appointment_time.slice(0, 5)
                    : "-"}
                </td>

                <td>
                  <StatusBadge $status={b.status}>
                    {b.status}
                  </StatusBadge>
                </td>

                <td>
                  {(b.status === "SCHEDULED" ||
                    b.status === "PENDING") && (
                    <>
                      <CompleteBtn
                        disabled={loadingId === b.id}
                        onClick={() =>
                          handleStatus(b.id, "COMPLETED")
                        }
                      >
                        Complete
                      </CompleteBtn>

                      <CancelBtn
                        disabled={loadingId === b.id}
                        onClick={() =>
                          handleStatus(b.id, "CANCELLED")
                        }
                      >
                        Cancel
                      </CancelBtn>

                      <RescheduleBtn
                        onClick={() => setEditingId(b.id)}
                      >
                        Reschedule
                      </RescheduleBtn>
                    </>
                  )}

                  <DeleteBtn
                    disabled={loadingId === b.id}
                    onClick={() => handleDelete(b.id)}
                  >
                    Delete
                  </DeleteBtn>

                  {editingId === b.id && (
                    <RescheduleBox>
                      <DateInput
                        type="date"
                        value={newDate}
                        onChange={(e) =>
                          setNewDate(e.target.value)
                        }
                      />

                      <TimeInput
                        type="time"
                        value={newTime}
                        onChange={(e) =>
                          setNewTime(e.target.value)
                        }
                      />

                      <SaveBtn
                        disabled={loadingId === b.id}
                        onClick={() => handleReschedule(b.id)}
                      >
                        Save
                      </SaveBtn>
                    </RescheduleBox>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Wrapper>
  );
}
const Wrapper = styled.div`
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px;
    border-bottom: 1px solid #eee;
    text-align: left;
  }

  th {
    background: #f3f4f6;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;

  background: ${(props) =>
    props.$status === "SCHEDULED"
      ? "#3b82f6"
      : props.$status === "COMPLETED"
      ? "#10b981"
      : "#ef4444"};
`;

const CompleteBtn = styled.button`
  margin-right: 8px;
  background: #16a34a;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #15803d;
  }
`;

const CancelBtn = styled.button`
  margin-right: 8px;
  background: #dc2626;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #b91c1c;
  }
`;

const RescheduleBtn = styled.button`
  background: #f59e0b;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #d97706;
  }
`;

const RescheduleBox = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const DateInput = styled.input`
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ddd;
`;

const TimeInput = styled.input`
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ddd;
`;

const SaveBtn = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }
`;

const Empty = styled.p`
  padding: 20px;
  text-align: center;
  font-weight: 500;
  color: #6b7280;
`;

const DeleteBtn = styled.button`
  margin-left: 8px;
  background: #6b7280;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #4b5563;
  }
`;
