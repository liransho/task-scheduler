import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

const BaseButton = styled(motion.button)<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
  }

  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: 8px 14px;
          font-size: 13px;
        `;
      case 'lg':
        return css`
          padding: 14px 28px;
          font-size: 16px;
        `;
      default:
        return css`
          padding: 10px 20px;
          font-size: 14px;
        `;
    }
  }}

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          color: #334155;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
        `;
      case 'danger':
        return css`
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          box-shadow: 0 2px 4px rgba(239,68,68,0.3);
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(239,68,68,0.4);
          }
        `;
      case 'success':
        return css`
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 2px 4px rgba(16,185,129,0.3);
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(16,185,129,0.4);
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: #3b82f6;
          &::before {
            display: none;
          }
          &:hover:not(:disabled) {
            background: rgba(59, 130, 246, 0.1);
          }
        `;
      default:
        return css`
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          box-shadow: 0 2px 4px rgba(59,130,246,0.3);
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59,130,246,0.4);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }
`;

export const Button: React.FC<
  ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }
> = ({ children, ...props }) => {
  return (
    <BaseButton
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </BaseButton>
  );
};
