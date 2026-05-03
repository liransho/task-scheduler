import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import type { AlertType } from '../../hooks/useAlert';

interface AlertContainerProps {
  $variant: AlertType;
}

const AlertContainer = styled(motion.div)<AlertContainerProps>`
  padding: 14px 18px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  ${({ $variant }) =>
    $variant === 'success'
      ? `
        background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
        color: #065f46;
        border: 1px solid #6ee7b7;
      `
      : `
        background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
        color: #991b1b;
        border: 1px solid #f87171;
      `}
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface AlertProps {
  type: AlertType;
  message: string;
}

export const Alert: React.FC<AlertProps> = ({ type, message }) => {
  return (
    <AlertContainer
      $variant={type}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <IconWrapper>
        {type === 'success' ? (
          <FiCheckCircle size={20} />
        ) : (
          <FiAlertCircle size={20} />
        )}
      </IconWrapper>
      {message}
    </AlertContainer>
  );
};
