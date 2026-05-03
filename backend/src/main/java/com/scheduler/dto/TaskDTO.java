package com.scheduler.dto;

import com.scheduler.entity.TaskType;
import java.util.List;
import java.util.UUID;

public record TaskDTO(
        UUID id,
        String name,
        String description,
        TaskType taskType,
        List<TaskParameterDefinitionDTO> parameterDefinitions
) {}
