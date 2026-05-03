import styled from 'styled-components';
import { format } from 'date-fns';
import type { Schedule, ScheduleType } from '../types';
import { Button, Toggle, Badge, EmptyState, LoadingSpinner } from './common';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  background-color: #f8fafc;
  font-weight: 600;
  font-size: 13px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
  color: #334155;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f8fafc;
  }
`;

const ScheduleName = styled.strong`
  color: #1e293b;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

interface ScheduleTableProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  loading?: boolean;
}

const SCHEDULE_TYPE_BADGES: Record<ScheduleType, { variant: 'info' | 'warning' | 'success' | 'secondary'; label: string }> = {
  ONE_TIME: { variant: 'info', label: 'One Time' },
  RECURRING: { variant: 'warning', label: 'Recurring' },
  WEEKLY: { variant: 'success', label: 'Weekly' },
  CRON: { variant: 'secondary', label: 'Cron' },
};

function formatScheduleDetails(schedule: Schedule): string {
  switch (schedule.scheduleType) {
    case 'ONE_TIME':
      return schedule.startTime
        ? format(new Date(schedule.startTime), 'PPp')
        : 'Not set';
    case 'RECURRING':
      return `Every ${schedule.intervalValue} ${schedule.intervalUnit?.toLowerCase()}`;
    case 'WEEKLY':
      return `${schedule.daysOfWeek} at ${schedule.timeOfDay || '09:00'}`;
    case 'CRON':
      return schedule.cronExpression || 'Not set';
    default:
      return '-';
  }
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  schedules,
  onEdit,
  onDelete,
  onToggle,
  loading,
}) => {
  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (schedules.length === 0) {
    return (
      <EmptyState
        icon="📅"
        title="No schedules yet"
        description="Create your first schedule to get started."
      />
    );
  }

  return (
    <Table>
      <thead>
        <tr>
          <Th>Name</Th>
          <Th>Task</Th>
          <Th>Type</Th>
          <Th>Schedule</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {schedules.map((schedule) => {
          const badgeConfig = SCHEDULE_TYPE_BADGES[schedule.scheduleType];
          return (
            <Tr key={schedule.id}>
              <Td>
                <ScheduleName>{schedule.name}</ScheduleName>
              </Td>
              <Td>{schedule.taskName}</Td>
              <Td>
                <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>
              </Td>
              <Td>{formatScheduleDetails(schedule)}</Td>
              <Td>
                <Toggle
                  checked={schedule.enabled}
                  onChange={() => onToggle(schedule.id)}
                />
              </Td>
              <Td>
                <Actions>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(schedule)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(schedule.id)}
                  >
                    Delete
                  </Button>
                </Actions>
              </Td>
            </Tr>
          );
        })}
      </tbody>
    </Table>
  );
};
