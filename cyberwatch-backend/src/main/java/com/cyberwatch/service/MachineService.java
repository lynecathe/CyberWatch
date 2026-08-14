package com.cyberwatch.service;

import com.cyberwatch.entity.Machine;
import com.cyberwatch.entity.MachineStatus;
import com.cyberwatch.repository.MachineRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MachineService {

    private final MachineRepository machineRepository;

    public MachineService(
            MachineRepository machineRepository
    ) {
        this.machineRepository = machineRepository;
    }

    public List<Machine> getAllMachines() {
        return machineRepository.findAll();
    }

    public Machine getMachineById(Long id) {
        return machineRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException("Machine not found")
                );
    }

    public Machine createMachine(Machine machine) {

        if (machineRepository.existsByHostname(machine.getHostname())) {
            throw new IllegalStateException(
                    "A machine with this hostname already exists"
            );
        }

        if (machineRepository.existsByIpAddress(machine.getIpAddress())) {
            throw new IllegalStateException(
                    "A machine with this IP address already exists"
            );
        }

        return machineRepository.save(machine);
    }

    public Machine updateStatus(
            Long id,
            MachineStatus status
    ) {

        Machine machine = getMachineById(id);

        machine.setStatus(status);
        machine.setLastSeen(LocalDateTime.now());

        return machineRepository.save(machine);
    }

    public void deleteMachine(Long id) {

        if (!machineRepository.existsById(id)) {
            throw new IllegalArgumentException("Machine not found");
        }

        machineRepository.deleteById(id);
    }
}