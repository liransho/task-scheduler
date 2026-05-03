import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DaySelector } from './DaySelector';

describe('DaySelector', () => {
  const allDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  it('renders all days of the week', () => {
    const onChange = vi.fn();
    render(<DaySelector selectedDays={[]} onChange={onChange} />);

    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Thu')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
  });

  it('checks selected days', () => {
    const onChange = vi.fn();
    render(<DaySelector selectedDays={['MON', 'WED', 'FRI']} onChange={onChange} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked(); // MON
    expect(checkboxes[1]).not.toBeChecked(); // TUE
    expect(checkboxes[2]).toBeChecked(); // WED
    expect(checkboxes[3]).not.toBeChecked(); // THU
    expect(checkboxes[4]).toBeChecked(); // FRI
  });

  it('calls onChange with added day when clicking unchecked day', () => {
    const onChange = vi.fn();
    render(<DaySelector selectedDays={['MON']} onChange={onChange} />);

    const tuesdayCheckbox = screen.getAllByRole('checkbox')[1];
    fireEvent.click(tuesdayCheckbox);

    expect(onChange).toHaveBeenCalledWith(['MON', 'TUE']);
  });

  it('calls onChange with removed day when clicking checked day', () => {
    const onChange = vi.fn();
    render(<DaySelector selectedDays={['MON', 'TUE']} onChange={onChange} />);

    const mondayCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(mondayCheckbox);

    expect(onChange).toHaveBeenCalledWith(['TUE']);
  });

  it('handles empty selection', () => {
    const onChange = vi.fn();
    render(<DaySelector selectedDays={['MON']} onChange={onChange} />);

    const mondayCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(mondayCheckbox);

    expect(onChange).toHaveBeenCalledWith([]);
  });
});
