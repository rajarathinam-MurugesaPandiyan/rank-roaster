import { ConfigProvider, theme } from 'antd';
import { Provider } from 'react-redux';
import { store, useAppSelector } from './redux/store';
import { AppRoutes } from './routes/AppRoutes';
import './App.css';

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentTheme = useAppSelector((state) => state.roaster.theme);
  const isDark = currentTheme === "dark";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: isDark ? '#45a29e' : '#0b8280',      // Teal primary action
          colorSuccess: isDark ? '#45a29e' : '#0b8280',      // Teal success indicators
          colorWarning: isDark ? '#ffa552' : '#e07a1a',      // Amber highlight indicators
          colorError: '#ff4d4f',        // Standard error indicator
          fontFamily: 'var(--font-sans)',
          borderRadius: 8,              // Rounded border settings
          colorBgBase: isDark ? '#0b0d10' : '#f4f6f8',        // App Background
          colorBgContainer: isDark ? '#161b22' : '#ffffff',   // Card / Table Background
          colorBgElevated: isDark ? '#21262d' : '#f0f2f5',    // Modal / Pop-over Background
          colorBorder: isDark ? '#30363d' : '#e1e4e8',        // Borders & Dividers
          colorBorderSecondary: isDark ? '#30363d' : '#e1e4e8',
          colorText: isDark ? '#f0f6fc' : '#1f2328',          // Primary Text
          colorTextSecondary: isDark ? '#8b949e' : '#57606a', // Secondary Text
          colorTextDescription: isDark ? '#8b949e' : '#57606a',
          colorTextPlaceholder: isDark ? '#484f58' : '#8c959f', // Disabled / Placeholder Text
          colorTextDisabled: isDark ? '#484f58' : '#8c959f'
        },
        components: {
          Button: {
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            controlHeight: 40
          },
          Input: {
            controlHeight: 48,
            colorBgContainer: isDark ? '#161b22' : '#ffffff',
            colorBorder: isDark ? '#30363d' : '#e1e4e8'
          },
          Card: {
            colorBgContainer: isDark ? '#161b22' : '#ffffff',
            colorBorderSecondary: isDark ? '#30363d' : '#e1e4e8'
          },
          Table: {
            colorBgContainer: isDark ? '#161b22' : '#ffffff',
            headerBg: isDark ? 'rgba(69, 162, 158, 0.05)' : 'rgba(11, 130, 128, 0.05)',
            colorBorder: isDark ? '#30363d' : '#e1e4e8'
          },
          Tag: {
            borderRadiusSM: 4
          },
          Collapse: {
            colorBgContainer: isDark ? '#161b22' : '#ffffff',
            colorBorder: isDark ? '#30363d' : '#e1e4e8'
          }
        }
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
