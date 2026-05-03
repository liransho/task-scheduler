package com.scheduler.dto;

import com.scheduler.entity.ScheduleType;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public record ScheduleDTO(
        UUID id,
        UUID taskId,
        String taskName,
        String name,
        ScheduleType scheduleType,
        String cronExpression,
        LocalDateTime startTime,
        Integer intervalValue,
        String intervalUnit,
        String daysOfWeek,
        String timeOfDay,
        boolean enabled,
        Map<String, String> parameters,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
