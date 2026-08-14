package com.cyberwatch.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "machines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Machine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String hostname;

    @Column(name = "ip_address", nullable = false, unique = true)
    private String ipAddress;

    @Column(name = "operating_system")
    private String operatingSystem;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MachineStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MachineCriticality criticality;

    @Column(name = "last_seen")
    private LocalDateTime lastSeen;

    @PrePersist
    public void prePersist() {
        if (this.status == null) {
            this.status = MachineStatus.OFFLINE;
        }

        if (this.criticality == null) {
            this.criticality = MachineCriticality.MEDIUM;
        }

        if (this.lastSeen == null) {
            this.lastSeen = LocalDateTime.now();
        }
    }
}