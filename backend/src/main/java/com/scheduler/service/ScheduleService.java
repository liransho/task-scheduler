package com.scheduler.service;

import com.scheduler.dto.CreateScheduleRequest;
import com.scheduler.dto.ScheduleDTO;
import com.scheduler.entity.*;
import com.scheduler.mapper.ScheduleMapper;
import com.scheduler.repository.ScheduleRepository;
import com.scheduler.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final TaskRepository taskRepository;
    private final QuartzService quartzService;
    private final CronExpressionService cronExpressionService;
    private final ScheduleMapper scheduleMapper;

    @Transactional(readOnly = true)
    public List<ScheduleDTO> getAllSchedules() {
        return scheduleMapper.toDtoList(scheduleRepository.findAllWithDetails());
    }

    @Transactional(readOnly = true)
    public ScheduleDTO getScheduleById(UUID id) {
        return scheduleRepository.findByIdWithDetails(id)
                .map(scheduleMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found: " + id));
    }

    @Transactional
    public ScheduleDTO createSchedule(CreateScheduleRequest request) {
        Task task = findTaskOrThrow(request.taskId());
        validateRequiredParameters(task, request.parameters());

        String cronExpression = cronExpressionService.generateCronExpression(request);

        Schedule schedule = buildScheduleFromRequest(request, task, cronExpression);
        addParametersToSchedule(schedule, request.parameters());

        Schedule saved = scheduleRepository.save(schedule);
        quartzService.scheduleJob(saved);

        log.info("Created schedule: {} for task: {}", saved.getName(), task.getName());
        return scheduleMapper.toDto(saved);
    }

    @Transactional
    public ScheduleDTO updateSchedule(UUID id, CreateScheduleRequest request) {
        Schedule schedule = findScheduleOrThrow(id);
        Task task = findTaskOrThrow(request.taskId());
        validateRequiredParameters(task, request.parameters());

        String cronExpression = cronExpressionService.generateCronExpression(request);
        updateScheduleFromRequest(schedule, request, task, cronExpression);

        schedule.clearParameters();
        addParametersToSchedule(schedule, request.parameters());

        Schedule saved = scheduleRepository.save(schedule);
        quartzService.rescheduleJob(saved);

        log.info("Updated schedule: {}", saved.getName());
        return scheduleMapper.toDto(saved);
    }

    @Transactional
    public void deleteSchedule(UUID id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found: " + id));

        quartzService.deleteJob(schedule);
        scheduleRepository.delete(schedule);

        log.info("Deleted schedule: {}", schedule.getName());
    }

    @Transactional
    public ScheduleDTO toggleSchedule(UUID id) {
        Schedule schedule = findScheduleOrThrow(id);
        schedule.setEnabled(!schedule.isEnabled());
        Schedule saved = scheduleRepository.save(schedule);

        if (saved.isEnabled()) {
            quartzService.scheduleJob(saved);
        } else {
            quartzService.pauseJob(saved);
        }

        log.info("Toggled schedule: {} to {}", saved.getName(), saved.isEnabled() ? "enabled" : "disabled");
        return scheduleMapper.toDto(saved);
    }

    private Task findTaskOrThrow(UUID taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found: " + taskId));
    }

    private Schedule findScheduleOrThrow(UUID id) {
        return scheduleRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found: " + id));
    }

    private Schedule buildScheduleFromRequest(CreateScheduleRequest request, Task task, String cronExpression) {
        return Schedule.builder()
                .task(task)
                .name(request.name())
                .scheduleType(request.scheduleType())
                .cronExpression(cronExpression)
                .startTime(request.startTime())
                .intervalValue(request.intervalValue())
                .intervalUnit(request.intervalUnit())
                .daysOfWeek(request.daysOfWeek())
                .timeOfDay(request.timeOfDay())
                .enabled(true)
                .build();
    }

    private void updateScheduleFromRequest(Schedule schedule, CreateScheduleRequest request, Task task, String cronExpression) {
        schedule.setTask(task);
        schedule.setName(request.name());
        schedule.setScheduleType(request.scheduleType());
        schedule.setCronExpression(cronExpression);
        schedule.setStartTime(request.startTime());
        schedule.setIntervalValue(request.intervalValue());
        schedule.setIntervalUnit(request.intervalUnit());
        schedule.setDaysOfWeek(request.daysOfWeek());
        schedule.setTimeOfDay(request.timeOfDay());
    }

    private void addParametersToSchedule(Schedule schedule, Map<String, String> parameters) {
        if (parameters == null) return;

        parameters.forEach((name, value) -> {
            ScheduleParameter param = ScheduleParameter.builder()
                    .parameterName(name)
                    .parameterValue(value)
                    .build();
            schedule.addParameter(param);
        });
    }

    private void validateRequiredParameters(Task task, Map<String, String> parameters) {
        List<String> missingParams = task.getParameterDefinitions().stream()
                .filter(TaskParameterDefinition::isRequired)
                .map(TaskParameterDefinition::getName)
                .filter(name -> parameters == null || !parameters.containsKey(name) ||
                        parameters.get(name) == null || parameters.get(name).isBlank())
                .toList();

        if (!missingParams.isEmpty()) {
            throw new IllegalArgumentException("Missing required parameters: " + String.join(", ", missingParams));
        }
    }
}
