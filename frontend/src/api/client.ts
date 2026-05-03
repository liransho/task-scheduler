import axios from 'axios';
import type { Task, Schedule, CreateScheduleRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthCredentials = (username: string, password: string) => {
  const token = btoa(`${username}:${password}`);
  api.defaults.headers.common['Authorization'] = `Basic ${token}`;
};

export const clearAuthCredentials = () => {
  delete api.defaults.headers.common['Authorization'];
};

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get('/api/tasks');
  return response.data;
};

export const getSchedules = async (): Promise<Schedule[]> => {
  const response = await api.get('/api/schedules');
  return response.data;
};

export const getSchedule = async (id: string): Promise<Schedule> => {
  const response = await api.get(`/api/schedules/${id}`);
  return response.data;
};

export const createSchedule = async (data: CreateScheduleRequest): Promise<Schedule> => {
  const response = await api.post('/api/schedules', data);
  return response.data;
};

export const updateSchedule = async (id: string, data: CreateScheduleRequest): Promise<Schedule> => {
  const response = await api.put(`/api/schedules/${id}`, data);
  return response.data;
};

export const deleteSchedule = async (id: string): Promise<void> => {
  await api.delete(`/api/schedules/${id}`);
};

export const toggleSchedule = async (id: string): Promise<Schedule> => {
  const response = await api.patch(`/api/schedules/${id}/toggle`);
  return response.data;
};

export const testAuth = async (): Promise<boolean> => {
  try {
    await api.get('/api/tasks');
    return true;
  } catch {
    return false;
  }
};
