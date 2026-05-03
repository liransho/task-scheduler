package com.scheduler.repository;

import com.scheduler.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.parameterDefinitions")
    List<Task> findAllWithParameters();
}
