import { useState, useCallback } from 'react';
import styled from 'styled-components';
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
  background-color: #f5f7fa;
`;

const Header = styled.header`
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
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
        <Logo>
          <span>📅</span>
          <span>Task Scheduler</span>
        </Logo>
        <Button variant="ghost" onClick={handleLogout}>
          Logout
        </Button>
      </Header>

      <Main>
        {alert && <Alert type={alert.type} message={alert.message} />}

        <Card>
          <CardHeader>
            <CardTitle>Schedules</CardTitle>
            <Button onClick={handleCreate}>+ New Schedule</Button>
          </CardHeader>
          <ScheduleTable
            schedules={schedules}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onToggle={handleToggle}
            loading={loading}
          />
        </Card>
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
