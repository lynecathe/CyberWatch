package com.cyberwatch.controller;

import com.cyberwatch.entity.Machine;
import com.cyberwatch.entity.MachineStatus;
import com.cyberwatch.service.MachineService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/machines")
public class MachineController {

    private final MachineService machineService;

    public MachineController(
            MachineService machineService
    ) {
        this.machineService = machineService;
    }

    @GetMapping
    public List<Machine> getAllMachines() {
        return machineService.getAllMachines();
    }

    @GetMapping("/{id}")
    public Machine getMachineById(
            @PathVariable Long id
    ) {
        return machineService.getMachineById(id);
    }

    @PostMapping
    public ResponseEntity<Machine> createMachine(
            @RequestBody Machine machine
    ) {

        Machine savedMachine =
                machineService.createMachine(machine);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedMachine);
    }

    @PatchMapping("/{id}/status")
    public Machine updateStatus(
            @PathVariable Long id,
            @RequestParam MachineStatus status
    ) {
        return machineService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMachine(
            @PathVariable Long id
    ) {

        machineService.deleteMachine(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}