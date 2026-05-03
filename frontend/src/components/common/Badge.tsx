import styled from 'styled-components';

type BadgeVariant = 'success' | 'warning' | 'info' | 'secondary' | 'danger';

interface BadgeContainerProps {
  $variant: BadgeVariant;
}

const BadgeContainer = styled.span<BadgeContainerProps>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;

  ${({ $variant }) => {
    switch ($variant) {
      case 'success':
        return `
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
        `;
      case 'warning':
        return `
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
        `;
      case 'info':
        return `
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          color: #1e40af;
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
        `;
      default:
        return `
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          color: #475569;
        `;
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
