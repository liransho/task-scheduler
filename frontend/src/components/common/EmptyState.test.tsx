import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No items found" />);
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <EmptyState
        title="No schedules"
        description="Create your first schedule to get started"
      />
    );
    expect(screen.getByText('Create your first schedule to get started')).toBeInTheDocument();
  });

  it('renders default icon', () => {
    render(<EmptyState title="Empty" />);
    expect(screen.getByText('📋')).toBeInTheDocument();
  });

  it('renders custom icon', () => {
    render(<EmptyState title="Empty" icon="🎉" />);
    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(
      <EmptyState
        title="Empty"
        action={<button>Create New</button>}
      />
    );
    expect(screen.getByRole('button', { name: 'Create New' })).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<EmptyState title="Empty" />);
    const description = screen.queryByText('Create your first');
    expect(description).not.toBeInTheDocument();
  });
});
