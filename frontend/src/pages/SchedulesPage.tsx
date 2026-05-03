import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlus, FiLogOut, FiCalendar } from 'react-icons/fi';
import type { Schedule, CreateScheduleRequest } from '../types';
import { clearAuthCredentials } from '../api/client';
import { useSchedules, useTasks, useAlert } from '../hooks';
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  Alert,
  ConfirmDialog,
} from '../components/common';
import { ScheduleTable } from '../components/ScheduleTable';
import { ScheduleForm } from '../components/ScheduleForm';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
`;

const Header = styled.header`
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 0 24px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 22px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.02em;
`;

const LogoIcon = styled.div`
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
`;

const Main = styled(motion.main)`
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  margin-bottom: 8px;
`;

const PageDescription = styled.p`
  font-size: 16px;
  color: #64748b;
`;

const StyledCard = styled(Card)`
  animation: none;
`;

interface SchedulesPageProps {
  onLogout: () => void;
}

export const SchedulesPage: React.FC<SchedulesPageProps> = ({ onLogout }) => {
  const { tasks, loading: tasksLoading } = useTasks();
  const {
    schedules,
    loading: schedulesLoading,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    toggleSchedule,
  } = useSchedules();
  const { alert, showSuccess, showError } = useAlert();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Schedule | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreate = useCallback(() => {
    setEditingSchedule(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((schedule: Schedule) => {
    setEditingSchedule(schedule);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingSchedule(null);
  }, []);

  const handleSubmit = useCallback(
    async (data: CreateScheduleRequest) => {
      try {
        if (editingSchedule) {
          await updateSchedule(editingSchedule.id, data);
          showSuccess('Schedule updated successfully');
        } else {
          await createSchedule(data);
          showSuccess('Schedule created successfully');
        }
        handleCloseForm();
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to save schedule';
        showError(message);
        throw error;
      }
    },
    [editingSchedule, updateSchedule, createSchedule, showSuccess, showError, handleCloseForm]
  );

  const handleDeleteClick = useCallback((id: string) => {
    const schedule = schedules.find((s) => s.id === id);
    if (schedule) {
      setDeleteTarget(schedule);
    }
  }, [schedules]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await deleteSchedule(deleteTarget.id);
      showSuccess('Schedule deleted successfully');
      setDeleteTarget(null);
    } catch {
      showError('Failed to delete schedule');
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, deleteSchedule, showSuccess, showError]);

  const handleToggle = useCallback(
    async (id: string) => {
      try {
        await toggleSchedule(id);
      } catch {
        showError('Failed to toggle schedule');
      }
    },
    [toggleSchedule, showError]
  );

  const handleLogout = useCallback(() => {
    clearAuthCredentials();
    localStorage.removeItem('auth');
    onLogout();
  }, [onLogout]);

  const loading = tasksLoading || schedulesLoading;

  return (
    <Container>
      <Header>
        <Logo
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <LogoIcon>
            <FiCalendar size={22} color="white" />
          </LogoIcon>
          <span>Task Scheduler</span>
        </Logo>
        <Button variant="ghost" onClick={handleLogout} style={{ color: 'white' }}>
          <FiLogOut size={18} />
          Logout
        </Button>
      </Header>

      <Main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {alert && <Alert type={alert.type} message={alert.message} />}

        <PageHeader>
          <PageTitle>Schedules</PageTitle>
          <PageDescription>
            Manage your scheduled tasks and automate recurring jobs
          </PageDescription>
        </PageHeader>

        <StyledCard>
          <CardHeader>
            <CardTitle>All Schedules</CardTitle>
            <Button onClick={handleCreate}>
              <FiPlus size={18} />
              New Schedule
            </Button>
          </CardHeader>
          <ScheduleTable
            schedules={schedules}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onToggle={handleToggle}
            loading={loading}
          />
        </StyledCard>
      </Main>

      <ScheduleForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        tasks={tasks}
        editingSchedule={editingSchedule}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Schedule"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={isDeleting}
      />
    </Container>
  );
};
