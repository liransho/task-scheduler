import { useState, useCallback, useEffect } from 'react';
import type { Schedule, CreateScheduleRequest } from '../types';
import {
  getSchedules,
  createSchedule as apiCreateSchedule,
  updateSchedule as apiUpdateSchedule,
  deleteSchedule as apiDeleteSchedule,
  toggleSchedule as apiToggleSchedule,
} from '../api/client';

interface UseSchedulesReturn {
  schedules: Schedule[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createSchedule: (data: CreateScheduleRequest) => Promise<Schedule>;
  updateSchedule: (id: string, data: CreateScheduleRequest) => Promise<Schedule>;
  deleteSchedule: (id: string) => Promise<void>;
  toggleSchedule: (id: string) => Promise<Schedule>;
}

export function useSchedules(): UseSchedulesReturn {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSchedules();
      setSchedules(data);
    } catch (err) {
      setError('Failed to load schedules');
      console.error('Failed to load schedules:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createSchedule = useCallback(async (data: CreateScheduleRequest): Promise<Schedule> => {
    const schedule = await apiCreateSchedule(data);
    await refresh();
    return schedule;
  }, [refresh]);

  const updateSchedule = useCallback(async (id: string, data: CreateScheduleRequest): Promise<Schedule> => {
    const schedule = await apiUpdateSchedule(id, data);
    await refresh();
    return schedule;
  }, [refresh]);

  const deleteSchedule = useCallback(async (id: string): Promise<void> => {
    await apiDeleteSchedule(id);
    await refresh();
  }, [refresh]);

  const toggleSchedule = useCallback(async (id: string): Promise<Schedule> => {
    const schedule = await apiToggleSchedule(id);
    await refresh();
    return schedule;
  }, [refresh]);

  return {
    schedules,
    loading,
    error,
    refresh,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    toggleSchedule,
  };
}
