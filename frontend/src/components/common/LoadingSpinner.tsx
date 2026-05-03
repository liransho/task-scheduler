import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div<{ $size?: 'sm' | 'md' | 'lg' }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '8px';
      case 'lg': return '48px';
      default: return '24px';
    }
  }};
`;

const Spinner = styled.div<{ $size?: 'sm' | 'md' | 'lg' }>`
  width: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '16px';
      case 'lg': return '48px';
      default: return '32px';
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case 'sm': return '16px';
      case 'lg': return '48px';
      default: return '32px';
    }
  }};
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  return (
    <SpinnerContainer $size={size}>
      <Spinner $size={size} />
    </SpinnerContainer>
  );
};
