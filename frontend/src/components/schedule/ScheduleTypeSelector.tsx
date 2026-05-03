import styled from 'styled-components';
import type { ScheduleType } from '../../types';

const Container = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const TypeButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px;
  border: 2px solid ${({ $active }) => ($active ? '#3b82f6' : '#e2e8f0')};
  background-color: ${({ $active }) => ($active ? '#eff6ff' : 'white')};
  color: ${({ $active }) => ($active ? '#3b82f6' : '#64748b')};
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
  }
`;

const SCHEDULE_TYPES: { value: ScheduleType; label: string }[] = [
  { value: 'ONE_TIME', label: 'One Time' },
  { value: 'RECURRING', label: 'Recurring' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'CRON', label: 'Cron' },
];

interface ScheduleTypeSelectorProps {
  value: ScheduleType;
  onChange: (type: ScheduleType) => void;
}

export const ScheduleTypeSelector: React.FC<ScheduleTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <Container>
      {SCHEDULE_TYPES.map((type) => (
        <TypeButton
          key={type.value}
          type="button"
          $active={value === type.value}
          onClick={() => onChange(type.value)}
        >
          {type.label}
        </TypeButton>
      ))}
    </Container>
  );
};
