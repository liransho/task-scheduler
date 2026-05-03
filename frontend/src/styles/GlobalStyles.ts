import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f7fa;
    color: #333;
    line-height: 1.6;
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  input, select, textarea {
    font-family: inherit;
  }
`;

export const theme = {
  colors: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#64748b',
    success: '#22c55e',
    danger: '#ef4444',
    dangerHover: '#dc2626',
    warning: '#f59e0b',
    background: '#f5f7fa',
    white: '#ffffff',
    border: '#e2e8f0',
    text: '#334155',
    textLight: '#64748b',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
};
