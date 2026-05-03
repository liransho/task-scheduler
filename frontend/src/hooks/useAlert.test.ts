import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAlert } from './useAlert';

describe('useAlert', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with no alert', () => {
    const { result } = renderHook(() => useAlert());
    expect(result.current.alert).toBeNull();
  });

  it('should show success alert', () => {
    const { result } = renderHook(() => useAlert());

    act(() => {
      result.current.showSuccess('Success message');
    });

    expect(result.current.alert).toEqual({
      type: 'success',
      message: 'Success message',
    });
  });

  it('should show error alert', () => {
    const { result } = renderHook(() => useAlert());

    act(() => {
      result.current.showError('Error message');
    });

    expect(result.current.alert).toEqual({
      type: 'error',
      message: 'Error message',
    });
  });

  it('should auto-hide alert after timeout', () => {
    const { result } = renderHook(() => useAlert(3000));

    act(() => {
      result.current.showSuccess('Auto-hide message');
    });

    expect(result.current.alert).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.alert).toBeNull();
  });

  it('should clear alert manually', () => {
    const { result } = renderHook(() => useAlert());

    act(() => {
      result.current.showSuccess('Message');
    });

    expect(result.current.alert).not.toBeNull();

    act(() => {
      result.current.clearAlert();
    });

    expect(result.current.alert).toBeNull();
  });

  it('should use custom auto-hide duration', () => {
    const { result } = renderHook(() => useAlert(5000));

    act(() => {
      result.current.showSuccess('Message');
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.alert).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.alert).toBeNull();
  });
});
