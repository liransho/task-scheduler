package com.scheduler.service;

import com.scheduler.dto.CreateScheduleRequest;
import com.scheduler.dto.ScheduleDTO;
import com.scheduler.entity.*;
import com.scheduler.mapper.ScheduleMapper;
import com.scheduler.repository.ScheduleRepository;
import com.scheduler.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ScheduleServiceTest {

    @Mock
    private ScheduleRepository scheduleRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private QuartzService quartzService;

    @Mock
    private CronExpressionService cronExpressionService;

    @Mock
    private ScheduleMapper scheduleMapper;

    private ScheduleService scheduleService;

    private Task testTask;
    private Schedule testSchedule;

    @BeforeEach
    void setUp() {
        scheduleService = new ScheduleService(
                scheduleRepository,
                taskRepository,
                quartzService,
                cronExpressionService,
                scheduleMapper
        );

        testTask = Task.builder()
                .id(UUID.randomUUID())
                .name("Test Task")
                .description("A test task")
                .taskType(TaskType.LOG_TASK)
                .parameterDefinitions(new ArrayList<>())
                .build();

        testSchedule = Schedule.builder()
                .id(UUID.randomUUID())
                .task(testTask)
                .name("Test Schedule")
                .scheduleType(ScheduleType.ONE_TIME)
                .cronExpression("0 0 12 * * ?")
                .startTime(LocalDateTime.now().plusDays(1))
                .enabled(true)
                .parameters(new ArrayList<>())
                .build();
    }

    @Test
    void getAllSchedules_ReturnsListOfSchedules() {
        ScheduleDTO expectedDto = new ScheduleDTO(
                testSchedule.getId(),
                testTask.getId(),
                testTask.getName(),
                testSchedule.getName(),
                testSchedule.getScheduleType(),
                testSchedule.getCronExpression(),
                testSchedule.getStartTime(),
                null, null, null, null,
                true, Map.of(), null, null
        );

        when(scheduleRepository.findAllWithDetails()).thenReturn(List.of(testSchedule));
        when(scheduleMapper.toDtoList(any())).thenReturn(List.of(expectedDto));

        List<ScheduleDTO> result = scheduleService.getAllSchedules();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testSchedule.getName(), result.get(0).name());
        verify(scheduleRepository).findAllWithDetails();
    }

    @Test
    void createSchedule_Success() {
        LocalDateTime startTime = LocalDateTime.now().plusDays(1);
        CreateScheduleRequest request = new CreateScheduleRequest(
                testTask.getId(),
                "New Schedule",
                ScheduleType.ONE_TIME,
                null,
                startTime,
                null, null, null, null,
                Map.of()
        );

        ScheduleDTO expectedDto = new ScheduleDTO(
                UUID.randomUUID(),
                testTask.getId(),
                testTask.getName(),
                "New Schedule",
                ScheduleType.ONE_TIME,
                "0 0 12 * * ?",
                startTime,
                null, null, null, null,
                true, Map.of(), null, null
        );

        when(taskRepository.findById(testTask.getId())).thenReturn(Optional.of(testTask));
        when(cronExpressionService.generateCronExpression(any())).thenReturn("0 0 12 * * ?");
        when(scheduleRepository.save(any(Schedule.class))).thenAnswer(inv -> {
            Schedule s = inv.getArgument(0);
            s.setId(UUID.randomUUID());
            return s;
        });
        when(scheduleMapper.toDto(any(Schedule.class))).thenReturn(expectedDto);

        ScheduleDTO result = scheduleService.createSchedule(request);

        assertNotNull(result);
        assertEquals("New Schedule", result.name());
        verify(quartzService).scheduleJob(any(Schedule.class));
    }

    @Test
    void createSchedule_MissingRequiredParameter_ThrowsException() {
        TaskParameterDefinition requiredParam = TaskParameterDefinition.builder()
                .name("message")
                .type(ParameterType.STRING)
                .required(true)
                .build();
        testTask.getParameterDefinitions().add(requiredParam);

        CreateScheduleRequest request = new CreateScheduleRequest(
                testTask.getId(),
                "New Schedule",
                ScheduleType.ONE_TIME,
                null,
                LocalDateTime.now().plusDays(1),
                null, null, null, null,
                Map.of()
        );

        when(taskRepository.findById(testTask.getId())).thenReturn(Optional.of(testTask));

        assertThrows(IllegalArgumentException.class, () ->
                scheduleService.createSchedule(request));
    }

    @Test
    void deleteSchedule_Success() {
        when(scheduleRepository.findById(testSchedule.getId())).thenReturn(Optional.of(testSchedule));

        scheduleService.deleteSchedule(testSchedule.getId());

        verify(quartzService).deleteJob(testSchedule);
        verify(scheduleRepository).delete(testSchedule);
    }

    @Test
    void toggleSchedule_EnablesDisabledSchedule() {
        testSchedule.setEnabled(false);

        ScheduleDTO expectedDto = new ScheduleDTO(
                testSchedule.getId(),
                testTask.getId(),
                testTask.getName(),
                testSchedule.getName(),
                testSchedule.getScheduleType(),
                testSchedule.getCronExpression(),
                testSchedule.getStartTime(),
                null, null, null, null,
                true, Map.of(), null, null
        );

        when(scheduleRepository.findByIdWithDetails(testSchedule.getId())).thenReturn(Optional.of(testSchedule));
        when(scheduleRepository.save(any(Schedule.class))).thenReturn(testSchedule);
        when(scheduleMapper.toDto(any(Schedule.class))).thenReturn(expectedDto);

        ScheduleDTO result = scheduleService.toggleSchedule(testSchedule.getId());

        assertTrue(result.enabled());
        verify(quartzService).scheduleJob(testSchedule);
    }
}
