package com.scheduler.repository;

import com.scheduler.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, UUID> {
    @Query("SELECT s FROM Schedule s LEFT JOIN FETCH s.task LEFT JOIN FETCH s.parameters")
    List<Schedule> findAllWithDetails();

    @Query("SELECT s FROM Schedule s LEFT JOIN FETCH s.task LEFT JOIN FETCH s.parameters WHERE s.id = :id")
    Optional<Schedule> findByIdWithDetails(UUID id);

    List<Schedule> findByEnabledTrue();
}
