import styled from "styled-components";

export default function Sidebar({ active, setActive }) {
  const menu = [
    "Overview",
    "Bookings",
    "Leads",
    "Forms",
    "Inbox",
    "Inventory",
    "Staff"
  ];

  return (
    <Container>
      <Logo>CareOps</Logo>

      <Menu>
        {menu.map((item) => (
          <MenuItem
            key={item}
            active={active === item}
            onClick={() => setActive(item)}
          >
            {item}
          </MenuItem>
        ))}
      </Menu>
    </Container>
  );
}

const Container = styled.div`
  width: 240px;
  background: #0f172a;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
`;

const Logo = styled.h2`
  margin-bottom: 40px;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MenuItem = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  background: ${(props) => (props.active ? "#1e293b" : "transparent")};

  &:hover {
    background: #1e293b;
  }
`;
