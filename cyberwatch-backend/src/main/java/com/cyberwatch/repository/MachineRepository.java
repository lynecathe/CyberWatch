package com.cyberwatch.repository;

import com.cyberwatch.entity.Machine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MachineRepository
        extends JpaRepository<Machine, Long> {

    boolean existsByHostname(String hostname);

    boolean existsByIpAddress(String ipAddress);

    Optional<Machine> findByIpAddress(String ipAddress);
}