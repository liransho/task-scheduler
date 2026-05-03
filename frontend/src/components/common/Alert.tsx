import styled from 'styled-components';
import type { AlertType } from '../../hooks/useAlert';

interface AlertContainerProps {
  $variant: AlertType;
}

const AlertContainer = styled.div<AlertContainerProps>`
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ $variant }) =>
    $variant === 'success'
      ? `
        background-color: #dcfce7;
        color: #166534;
        border: 1px solid #86efac;
      `
      : `
        background-color: #fee2e2;
        color: #991b1b;
        border: 1px solid #fca5a5;
      `}
`;

const Icon = styled.span`
  font-size: 16px;
`;

interface AlertProps {
  type: AlertType;
  message: string;
}

export const Alert: React.FC<AlertProps> = ({ type, message }) => {
  return (
    <AlertContainer $variant={type}>
      <Icon>{type === 'success' ? '✓' : '!'}</Icon>
      {message}
    </AlertContainer>
  );
};
