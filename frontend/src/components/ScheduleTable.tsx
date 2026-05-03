import styled from 'styled-components';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FiEdit2, FiTrash2, FiClock, FiRepeat, FiCalendar, FiTerminal } from 'react-icons/fi';
import type { Schedule, ScheduleType } from '../types';
import { Button, Toggle, Badge, EmptyState, LoadingSpinner } from './common';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 14px 20px;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  font-weight: 600;
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 18px 20px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #334155;
`;

const Tr = styled(motion.tr)`
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8fafc;
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const ScheduleName = styled.div`
  font-weight: 600;
  color: #0f172a;
  font-size: 15px;
`;

const ScheduleDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 13px;
  margin-top: 2px;
`;

const TaskBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const IconButton = styled(motion.button)<{ $variant?: 'ghost' | 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $variant }) =>
    $variant === 'danger'
      ? `
        background: #fef2f2;
        color: #ef4444;
        &:hover {
          background: #fee2e2;
          color: #dc2626;
        }
      `
      : `
        background: #f1f5f9;
        color: #64748b;
        &:hover {
          background: #e2e8f0;
          color: #334155;
        }
      `}
`;

interface ScheduleTableProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  loading?: boolean;
}

const SCHEDULE_TYPE_CONFIG: Record<ScheduleType, {
  variant: 'info' | 'warning' | 'success' | 'secondary';
  label: string;
  icon: React.ReactNode;
}> = {
  ONE_TIME: { variant: 'info', label: 'One Time', icon: <FiClock size={12} /> },
  RECURRING: { variant: 'warning', label: 'Recurring', icon: <FiRepeat size={12} /> },
  WEEKLY: { variant: 'success', label: 'Weekly', icon: <FiCalendar size={12} /> },
  CRON: { variant: 'secondary', label: 'Cron', icon: <FiTerminal size={12} /> },
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
        description="Create your first schedule to start automating tasks"
        action={
          <Button onClick={() => {}}>
            Create Schedule
          </Button>
        }
      />
    );
  }

  return (
    <Table>
      <thead>
        <tr>
          <Th>Schedule</Th>
          <Th>Task</Th>
          <Th>Type</Th>
          <Th>Timing</Th>
          <Th>Status</Th>
          <Th style={{ width: 120 }}>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {schedules.map((schedule, index) => {
          const typeConfig = SCHEDULE_TYPE_CONFIG[schedule.scheduleType];
          return (
            <Tr
              key={schedule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Td>
                <ScheduleName>{schedule.name}</ScheduleName>
              </Td>
              <Td>
                <TaskBadge>{schedule.taskName}</TaskBadge>
              </Td>
              <Td>
                <Badge variant={typeConfig.variant}>
                  {typeConfig.icon}
                  {typeConfig.label}
                </Badge>
              </Td>
              <Td>
                <ScheduleDetails>
                  {formatScheduleDetails(schedule)}
                </ScheduleDetails>
              </Td>
              <Td>
                <Toggle
                  checked={schedule.enabled}
                  onChange={() => onToggle(schedule.id)}
                />
              </Td>
              <Td>
                <Actions>
                  <IconButton
                    onClick={() => onEdit(schedule)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiEdit2 size={16} />
                  </IconButton>
                  <IconButton
                    $variant="danger"
                    onClick={() => onDelete(schedule.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiTrash2 size={16} />
                  </IconButton>
                </Actions>
              </Td>
            </Tr>
          );
        })}
      </tbody>
    </Table>
  );
};
