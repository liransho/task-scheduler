import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ScheduleTypeSelector } from './ScheduleTypeSelector';

describe('ScheduleTypeSelector', () => {
  it('renders all schedule type options', () => {
    const onChange = vi.fn();
    render(<ScheduleTypeSelector value="ONE_TIME" onChange={onChange} />);

    expect(screen.getByText('One Time')).toBeInTheDocument();
    expect(screen.getByText('Recurring')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
    expect(screen.getByText('Cron')).toBeInTheDocument();
  });

  it('highlights the selected type', () => {
    const onChange = vi.fn();
    render(<ScheduleTypeSelector value="RECURRING" onChange={onChange} />);

    const recurringButton = screen.getByText('Recurring');
    expect(recurringButton).toBeInTheDocument();
  });

  it('calls onChange when a type is clicked', () => {
    const onChange = vi.fn();
    render(<ScheduleTypeSelector value="ONE_TIME" onChange={onChange} />);

    fireEvent.click(screen.getByText('Weekly'));
    expect(onChange).toHaveBeenCalledWith('WEEKLY');
  });

  it('calls onChange with correct type for each button', () => {
    const onChange = vi.fn();
    render(<ScheduleTypeSelector value="ONE_TIME" onChange={onChange} />);

    fireEvent.click(screen.getByText('One Time'));
    expect(onChange).toHaveBeenCalledWith('ONE_TIME');

    fireEvent.click(screen.getByText('Recurring'));
    expect(onChange).toHaveBeenCalledWith('RECURRING');

    fireEvent.click(screen.getByText('Weekly'));
    expect(onChange).toHaveBeenCalledWith('WEEKLY');

    fireEvent.click(screen.getByText('Cron'));
    expect(onChange).toHaveBeenCalledWith('CRON');
  });
});
