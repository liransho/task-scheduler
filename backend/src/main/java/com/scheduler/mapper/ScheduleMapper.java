package com.scheduler.mapper;

import com.scheduler.dto.ScheduleDTO;
import com.scheduler.dto.TaskDTO;
import com.scheduler.dto.TaskParameterDefinitionDTO;
import com.scheduler.entity.Schedule;
import com.scheduler.entity.Task;
import com.scheduler.entity.TaskParameterDefinition;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ScheduleMapper {

    @Mapping(target = "taskId", source = "task.id")
    @Mapping(target = "taskName", source = "task.name")
    @Mapping(target = "parameters", source = "parameters", qualifiedByName = "parametersToMap")
    ScheduleDTO toDto(Schedule schedule);

    List<ScheduleDTO> toDtoList(List<Schedule> schedules);

    TaskDTO toDto(Task task);

    List<TaskDTO> toTaskDtoList(List<Task> tasks);

    TaskParameterDefinitionDTO toDto(TaskParameterDefinition definition);

    @Named("parametersToMap")
    default Map<String, String> parametersToMap(List<com.scheduler.entity.ScheduleParameter> parameters) {
        if (parameters == null) {
            return Map.of();
        }
        return parameters.stream()
                .collect(Collectors.toMap(
                        p -> p.getParameterName(),
                        p -> p.getParameterValue() != null ? p.getParameterValue() : ""
                ));
    }
}
