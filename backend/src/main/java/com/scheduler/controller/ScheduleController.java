package com.scheduler.controller;

import com.scheduler.dto.ApiErrorResponse;
import com.scheduler.dto.CreateScheduleRequest;
import com.scheduler.dto.ScheduleDTO;
import com.scheduler.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Schedules", description = "Schedule management operations")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping
    @Operation(summary = "Get all schedules", description = "Retrieves a list of all configured schedules")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved schedules")
    public ResponseEntity<List<ScheduleDTO>> getAllSchedules() {
        return ResponseEntity.ok(scheduleService.getAllSchedules());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get schedule by ID", description = "Retrieves a specific schedule by its unique identifier")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Schedule found"),
            @ApiResponse(responseCode = "404", description = "Schedule not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<ScheduleDTO> getScheduleById(
            @Parameter(description = "Schedule UUID") @PathVariable UUID id) {
        return ResponseEntity.ok(scheduleService.getScheduleById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new schedule", description = "Creates a new schedule for a task with specified timing configuration")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Schedule created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Task not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<ScheduleDTO> createSchedule(
            @Valid @RequestBody CreateScheduleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(scheduleService.createSchedule(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a schedule", description = "Updates an existing schedule with new configuration")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Schedule updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Schedule or task not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<ScheduleDTO> updateSchedule(
            @Parameter(description = "Schedule UUID") @PathVariable UUID id,
            @Valid @RequestBody CreateScheduleRequest request) {
        return ResponseEntity.ok(scheduleService.updateSchedule(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a schedule", description = "Removes a schedule and stops its associated Quartz job")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Schedule deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Schedule not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<Void> deleteSchedule(
            @Parameter(description = "Schedule UUID") @PathVariable UUID id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    @Operation(summary = "Toggle schedule status", description = "Enables or disables a schedule, pausing or resuming its Quartz job")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Schedule toggled successfully"),
            @ApiResponse(responseCode = "404", description = "Schedule not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<ScheduleDTO> toggleSchedule(
            @Parameter(description = "Schedule UUID") @PathVariable UUID id) {
        return ResponseEntity.ok(scheduleService.toggleSchedule(id));
    }
}
