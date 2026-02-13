import styled from "styled-components";

export default function Header() {
  return (
    <Container>
      <Title>Dashboard</Title>
      <Profile>
        <Avatar>K</Avatar>
      </Profile>
    </Container>
  );
}

const Container = styled.div`
  height: 70px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

const Title = styled.h3`
  margin: 0;
`;

const Profile = styled.div``;

const Avatar = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #111827;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;
