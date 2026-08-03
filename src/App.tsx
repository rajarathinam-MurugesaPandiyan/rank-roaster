import React, { useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import { Provider } from "react-redux";
import { store, useAppSelector } from "./redux/store";
import { AppRoutes } from "./routes/AppRoutes";
import "./App.css";

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const currentTheme = useAppSelector((state) => state.roaster.theme);
  const isDark = currentTheme === "dark";

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }
  }, [isDark]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: isDark ? '#6366f1' : '#4f46e5',      // Electric Indigo primary action
          colorSuccess: isDark ? '#22d3ee' : '#06b6d4',      // Vibrant Cyan success
          colorWarning: isDark ? '#f59e0b' : '#d97706',      // Warm Amber warning
          colorError: isDark ? '#fb7185' : '#f43f5e',        // Coral Red error
          fontFamily: 'var(--font-sans)',
          borderRadius: 8,              // Rounded border settings
          colorBgBase: isDark ? '#0f172a' : '#f8f9ff',        // App Background
          colorBgContainer: isDark ? '#1e293b' : '#ffffff',   // Card / Table Background
          colorBgElevated: isDark ? '#334155' : '#f0f2fe',    // Modal / Pop-over Background
          colorBorder: isDark ? '#334155' : '#e0e7ff',        // Borders & Dividers
          colorBorderSecondary: isDark ? '#334155' : '#e0e7ff',
          colorText: isDark ? '#f8fafc' : '#1e1b4b',          // Primary Text
          colorTextSecondary: isDark ? '#94a3b8' : '#475569', // Secondary Text
          colorTextDescription: isDark ? '#94a3b8' : '#475569',
          colorTextPlaceholder: isDark ? '#64748b' : '#94a3b8', // Disabled / Placeholder Text
          colorTextDisabled: isDark ? '#64748b' : '#94a3b8'
        },
        components: {
          Button: {
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            controlHeight: 40
          },
          Input: {
            controlHeight: 48,
            colorBgContainer: isDark ? '#1e293b' : '#ffffff',
            colorBorder: isDark ? '#334155' : '#e0e7ff'
          },
          Card: {
            colorBgContainer: isDark ? '#1e293b' : '#ffffff',
            colorBorderSecondary: isDark ? '#334155' : '#e0e7ff'
          },
          Table: {
            colorBgContainer: isDark ? '#1e293b' : '#ffffff',
            headerBg: isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(79, 70, 229, 0.05)',
            colorBorder: isDark ? '#334155' : '#e0e7ff'
          },
          Tag: {
            borderRadiusSM: 4
          },
          Collapse: {
            colorBgContainer: isDark ? '#1e293b' : '#ffffff',
            colorBorder: isDark ? '#334155' : '#e0e7ff'
          }
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
