import styled from "styled-components";

export default function StatCard({ title, value }) {
  return (
    <Card>
      <h4>{title}</h4>
      <Value>{value}</Value>
    </Card>
  );
}

const Card = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  flex: 1;
`;

const Value = styled.h2`
  margin-top: 10px;
`;
