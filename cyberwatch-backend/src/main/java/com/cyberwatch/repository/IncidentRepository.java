package com.cyberwatch.repository;

import com.cyberwatch.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncidentRepository
        extends JpaRepository<Incident, Long> {
}