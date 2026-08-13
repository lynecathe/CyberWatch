package com.cyberwatch.repository;

import com.cyberwatch.entity.SecurityAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecurityAlertRepository
        extends JpaRepository<SecurityAlert, Long> {
}