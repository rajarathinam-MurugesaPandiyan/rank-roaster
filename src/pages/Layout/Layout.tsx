import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import { Layout } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { initializeSchool } from "../../redux/schoolSlice";
import {
  clearCurrentUser,
  toggleTheme,
} from "../../redux/roaster/roasterSlice";
import { schoolUnslugify } from "../../helpers/slugify";
import { eraseCookie } from "../../helpers/cookies";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const { Content } = Layout;

export const SchoolLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { schoolId } = useParams<{ schoolId: string }>();
  const [collapsed, setCollapsed] = useState(false);

  const activeSchool = schoolId || "default-school";
  const { currentUser, currentSchool, tabs, theme } = useAppSelector(
    (state) => state.roaster,
  );

  useEffect(() => {
    dispatch(initializeSchool(activeSchool));
  }, [activeSchool, dispatch]);

  const displaySchoolName =
    currentSchool?.name || schoolUnslugify(activeSchool);

  const getSelectedKey = () => {
    const path = location.pathname;
    const parts = path.split("/");
    const lastSegment = parts[parts.length - 1];
    return lastSegment || "dashboard";
  };

  const handleMenuClick = (info: { key: string }) => {
    navigate(`/${activeSchool}/${info.key}`);
  };

  const handleLogout = () => {
    eraseCookie("token");
    dispatch(clearCurrentUser());
    navigate("/");
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "transparent" }}>
      <Sidebar
        collapsed={collapsed}
        tabs={tabs}
        selectedKey={getSelectedKey()}
        onMenuClick={handleMenuClick}
        theme={theme}
      />

      <Layout style={{ background: "transparent" }}>
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          displaySchoolName={displaySchoolName}
          currentUser={currentUser}
          currentSchool={currentSchool}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={() => dispatch(toggleTheme())}
        />

        <Content
          style={{
            padding: "32px 24px",
            minHeight: "calc(100vh - 72px)",
            position: "relative",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default SchoolLayout;
