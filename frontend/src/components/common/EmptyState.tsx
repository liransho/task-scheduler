import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #64748b;
`;

const Icon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
`;

const Description = styled.p`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
`;

const ActionContainer = styled.div`
  margin-top: 16px;
`;

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📋',
  title,
  description,
  action,
}) => {
  return (
    <Container>
      <Icon>{icon}</Icon>
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      {action && <ActionContainer>{action}</ActionContainer>}
    </Container>
  );
};
