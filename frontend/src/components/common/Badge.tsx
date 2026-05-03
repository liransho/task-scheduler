import styled from 'styled-components';

type BadgeVariant = 'success' | 'warning' | 'info' | 'secondary' | 'danger';

interface BadgeContainerProps {
  $variant: BadgeVariant;
}

const BadgeContainer = styled.span<BadgeContainerProps>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;

  ${({ $variant }) => {
    switch ($variant) {
      case 'success':
        return 'background-color: #dcfce7; color: #166534;';
      case 'warning':
        return 'background-color: #fef3c7; color: #92400e;';
      case 'info':
        return 'background-color: #dbeafe; color: #1e40af;';
      case 'danger':
        return 'background-color: #fee2e2; color: #991b1b;';
      default:
        return 'background-color: #f1f5f9; color: #475569;';
    }
  }}
`;

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'secondary', children }) => {
  return <BadgeContainer $variant={variant}>{children}</BadgeContainer>;
};
