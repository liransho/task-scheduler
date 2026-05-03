import styled from 'styled-components';
import { Checkbox, CheckboxLabel } from '../common';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
`;

const DAYS_OF_WEEK = [
  { value: 'MON', label: 'Mon' },
  { value: 'TUE', label: 'Tue' },
  { value: 'WED', label: 'Wed' },
  { value: 'THU', label: 'Thu' },
  { value: 'FRI', label: 'Fri' },
  { value: 'SAT', label: 'Sat' },
  { value: 'SUN', label: 'Sun' },
] as const;

interface DaySelectorProps {
  selectedDays: string[];
  onChange: (days: string[]) => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDays,
  onChange,
}) => {
  const toggleDay = (day: string) => {
    const updated = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    onChange(updated);
  };

  return (
    <Container>
      {DAYS_OF_WEEK.map((day) => (
        <CheckboxLabel key={day.value}>
          <Checkbox
            checked={selectedDays.includes(day.value)}
            onChange={() => toggleDay(day.value)}
          />
          {day.label}
        </CheckboxLabel>
      ))}
    </Container>
  );
};
