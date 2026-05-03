package com.scheduler.controller;

import com.scheduler.dto.CreateScheduleRequest;
import com.scheduler.dto.ScheduleDTO;
import com.scheduler.entity.ScheduleType;
import com.scheduler.service.ScheduleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ScheduleControllerTest {

    @Mock
    private ScheduleService scheduleService;

    @InjectMocks
    private ScheduleController scheduleController;

    private ScheduleDTO testSchedule;
    private UUID scheduleId;
    private UUID taskId;

    @BeforeEach
    void setUp() {
        scheduleId = UUID.randomUUID();
        taskId = UUID.randomUUID();

        testSchedule = new ScheduleDTO(
                scheduleId,
                taskId,
                "Log Task",
                "Test Schedule",
                ScheduleType.RECURRING,
                "0 0/5 * * * ?",
                null,
                5,
                "MINUTES",
                null,
                null,
                true,
                Map.of("message", "Hello"),
                LocalDateTime.now(),
                LocalDateTime.now()
        );
    }

    @Test
    void getAllSchedules_ReturnsScheduleList() {
        when(scheduleService.getAllSchedules()).thenReturn(List.of(testSchedule));

        ResponseEntity<List<ScheduleDTO>> response = scheduleController.getAllSchedules();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(scheduleService).getAllSchedules();
    }

    @Test
    void getScheduleById_ReturnsSchedule() {
        when(scheduleService.getScheduleById(scheduleId)).thenReturn(testSchedule);

        ResponseEntity<ScheduleDTO> response = scheduleController.getScheduleById(scheduleId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testSchedule, response.getBody());
        verify(scheduleService).getScheduleById(scheduleId);
    }

    @Test
    void createSchedule_ReturnsCreatedSchedule() {
        CreateScheduleRequest request = new CreateScheduleRequest(
                taskId,
                "New Schedule",
                ScheduleType.RECURRING,
                null,
                null,
                5,
                "MINUTES",
                null,
                null,
                Map.of("message", "Hello")
        );

        when(scheduleService.createSchedule(request)).thenReturn(testSchedule);

        ResponseEntity<ScheduleDTO> response = scheduleController.createSchedule(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(testSchedule, response.getBody());
        verify(scheduleService).createSchedule(request);
    }

    @Test
    void updateSchedule_ReturnsUpdatedSchedule() {
        CreateScheduleRequest request = new CreateScheduleRequest(
                taskId,
                "Updated Schedule",
                ScheduleType.RECURRING,
                null,
                null,
                10,
                "MINUTES",
                null,
                null,
                Map.of("message", "Updated")
        );

        when(scheduleService.updateSchedule(scheduleId, request)).thenReturn(testSchedule);

        ResponseEntity<ScheduleDTO> response = scheduleController.updateSchedule(scheduleId, request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(scheduleService).updateSchedule(scheduleId, request);
    }

    @Test
    void deleteSchedule_ReturnsNoContent() {
        doNothing().when(scheduleService).deleteSchedule(scheduleId);

        ResponseEntity<Void> response = scheduleController.deleteSchedule(scheduleId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(scheduleService).deleteSchedule(scheduleId);
    }

    @Test
    void toggleSchedule_ReturnsToggledSchedule() {
        when(scheduleService.toggleSchedule(scheduleId)).thenReturn(testSchedule);

        ResponseEntity<ScheduleDTO> response = scheduleController.toggleSchedule(scheduleId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testSchedule, response.getBody());
        verify(scheduleService).toggleSchedule(scheduleId);
    }
}
