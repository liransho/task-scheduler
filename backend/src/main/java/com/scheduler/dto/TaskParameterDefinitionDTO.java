package com.scheduler.dto;

import com.scheduler.entity.ParameterType;
import java.util.UUID;

public record TaskParameterDefinitionDTO(
        UUID id,
        String name,
        ParameterType type,
        boolean required,
        String defaultValue,
        String description
) {}
