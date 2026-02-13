import { useState, useEffect } from "react";
import styled from "styled-components";
import Leads from "./Leads";
import Bookings from "./Bookings";
import { getDashboardStats } from "../services/api";

export default function Dashboard() {


const workspaceId = localStorage.getItem("workspace_id");


  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
useEffect(() => {
  if (workspaceId) {
    loadStats();
  }
}, [activeTab, workspaceId]);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats(workspaceId);
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  const renderOverview = () => {
    if (!stats) return <ContentBox>Loading analytics...</ContentBox>;

    return (
      <AnalyticsGrid>
        <StatCard>
          <h3>Total Leads</h3>
          <StatValue>{stats.total_leads}</StatValue>
        </StatCard>

        <StatCard>
          <h3>Converted Leads</h3>
          <StatValue>{stats.converted_leads}</StatValue>
        </StatCard>

        <StatCard>
          <h3>Conversion Rate</h3>
          <StatValue>{stats.conversion_rate}%</StatValue>
        </StatCard>

        <StatCard>
          <h3>Total Bookings</h3>
          <StatValue>{stats.total_bookings}</StatValue>
        </StatCard>

        <StatCard>
          <h3>Completed</h3>
          <StatValue>{stats.completed_bookings}</StatValue>
        </StatCard>

        <StatCard>
          <h3>Cancelled</h3>
          <StatValue>{stats.cancelled_bookings}</StatValue>
        </StatCard>
      </AnalyticsGrid>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "leads":
        return <Leads workspaceId={workspaceId} />;
      case "bookings":
        return <Bookings workspaceId={workspaceId} />;
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <Sidebar>
        <Logo>CareOps</Logo>

        <NavItem onClick={() => setActiveTab("overview")}>
          Overview
        </NavItem>

        <NavItem onClick={() => setActiveTab("leads")}>
          Leads
        </NavItem>

        <NavItem onClick={() => setActiveTab("bookings")}>
          Bookings
        </NavItem>
      </Sidebar>

      <Main>{renderContent()}</Main>
    </Wrapper>
  );
}

/* ================= STYLES ================= */

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #0f172a, #1e293b);
`;

const Sidebar = styled.div`
  width: 240px;
  background: #111827;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Logo = styled.h1`
  color: white;
  font-size: 20px;
  margin-bottom: 30px;
`;

const NavItem = styled.div`
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  color: #94a3b8;

  &:hover {
    background: #1e293b;
    color: white;
  }
`;

const Main = styled.div`
  flex: 1;
  padding: 40px;
`;

const ContentBox = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  min-height: 300px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
`;

const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
`;

const StatCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const StatValue = styled.h1`
  margin-top: 15px;
  font-size: 32px;
  font-weight: bold;
`;
