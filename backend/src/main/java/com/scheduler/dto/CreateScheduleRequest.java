package com.scheduler.dto;

import com.scheduler.entity.ScheduleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public record CreateScheduleRequest(
        @NotNull(message = "Task ID is required")
        UUID taskId,

        @NotBlank(message = "Name is required")
        String name,

        @NotNull(message = "Schedule type is required")
        ScheduleType scheduleType,

        String cronExpression,
        LocalDateTime startTime,
        Integer intervalValue,
        String intervalUnit,
        String daysOfWeek,
        String timeOfDay,
        Map<String, String> parameters
) {}
