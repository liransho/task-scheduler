import styled, { css } from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  transition: all 0.2s ease;

  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: 6px 12px;
          font-size: 13px;
        `;
      case 'lg':
        return css`
          padding: 12px 24px;
          font-size: 16px;
        `;
      default:
        return css`
          padding: 8px 16px;
          font-size: 14px;
        `;
    }
  }}

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: #e2e8f0;
          color: #334155;
          &:hover {
            background-color: #cbd5e1;
          }
        `;
      case 'danger':
        return css`
          background-color: #ef4444;
          color: white;
          &:hover {
            background-color: #dc2626;
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: #3b82f6;
          &:hover {
            background-color: #eff6ff;
          }
        `;
      default:
        return css`
          background-color: #3b82f6;
          color: white;
          &:hover {
            background-color: #2563eb;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
