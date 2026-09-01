import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  AlertService,
  SecurityAlert
} from '../../core/services/alert';

import {
  MachineService,
  Machine
} from '../../core/services/machine';

import {
  IncidentService,
  Incident
} from '../../core/services/incident';

interface ConnectedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ANALYST' | 'ADMIN';
}

@Component({
  selector: 'app-dashboard',

  imports: [
    CommonModule
  ],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  alerts: SecurityAlert[] = [];
  machines: Machine[] = [];
  incidents: Incident[] = [];

  currentUser: ConnectedUser | null = null;

  loading = true;
  errorMessage = '';

  constructor(
    private alertService: AlertService,
    private machineService: MachineService,
    private incidentService: IncidentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadCurrentUser();

    this.loadAlerts();
    this.loadMachines();

    if (this.canAccessIncidents) {
      this.loadIncidents();
    }

  }

  loadCurrentUser(): void {

    const storedUser =
      localStorage.getItem('cyberwatch_user');

    if (!storedUser) {
      this.currentUser = null;
      return;
    }

    try {

      this.currentUser =
        JSON.parse(storedUser) as ConnectedUser;

    } catch {

      this.currentUser = null;

    }

  }

  loadAlerts(): void {

    this.loading = true;
    this.errorMessage = '';

    this.alertService
      .getAllAlerts()
      .subscribe({

        next: (alerts) => {

          this.alerts = alerts;
          this.loading = false;

          this.cdr.markForCheck();

        },

        error: (error) => {

          console.error(
            'DASHBOARD ALERT ERROR',
            error
          );

          this.errorMessage =
            'Unable to load security alerts.';

          this.loading = false;

          this.cdr.markForCheck();

        }

      });

  }

  loadMachines(): void {

    this.machineService
      .getAllMachines()
      .subscribe({

        next: (machines) => {

          this.machines = machines;

          this.cdr.markForCheck();

        },

        error: (error) => {

          console.error(
            'DASHBOARD MACHINES ERROR',
            error
          );

        }

      });

  }

  loadIncidents(): void {

    this.incidentService
      .getAllIncidents()
      .subscribe({

        next: (incidents) => {

          this.incidents = incidents;

          this.cdr.markForCheck();

        },

        error: (error) => {

          console.error(
            'DASHBOARD INCIDENTS ERROR',
            error
          );

        }

      });

  }

  get canAccessIncidents(): boolean {

    return (
      this.currentUser?.role === 'ANALYST' ||
      this.currentUser?.role === 'ADMIN'
    );

  }

  // =========================
  // ALERT STATISTICS
  // =========================

  get totalAlerts(): number {
    return this.alerts.length;
  }

  get criticalAlerts(): number {

    return this.alerts.filter(
      alert =>
        alert.severity === 'CRITICAL'
    ).length;

  }

  get highAlerts(): number {

    return this.alerts.filter(
      alert =>
        alert.severity === 'HIGH'
    ).length;

  }

  get openAlerts(): number {

    return this.alerts.filter(
      alert =>
        alert.status !== 'RESOLVED'
    ).length;

  }

  // =========================
  // INCIDENT STATISTICS
  // =========================

  get totalIncidents(): number {
    return this.incidents.length;
  }

  get openIncidents(): number {

    return this.incidents.filter(
      incident =>
        incident.status === 'OPEN'
    ).length;

  }

  get investigatingIncidents(): number {

    return this.incidents.filter(
      incident =>
        incident.status === 'INVESTIGATING'
    ).length;

  }

  get resolvedIncidents(): number {

    return this.incidents.filter(
      incident =>
        incident.status === 'RESOLVED'
    ).length;

  }

  // =========================
  // MACHINE STATISTICS
  // =========================

  get totalMachines(): number {
    return this.machines.length;
  }

  get onlineMachines(): number {

    return this.machines.filter(
      machine =>
        machine.status === 'ONLINE'
    ).length;

  }

  get offlineMachines(): number {

    return this.machines.filter(
      machine =>
        machine.status === 'OFFLINE'
    ).length;

  }

  get compromisedMachines(): number {

    return this.machines.filter(
      machine =>
        machine.status === 'COMPROMISED'
    ).length;

  }

  // =========================
  // RECENT ALERTS
  // =========================

  get recentAlerts(): SecurityAlert[] {

    return [...this.alerts]
      .sort(
        (a, b) =>
          new Date(b.detectedAt).getTime() -
          new Date(a.detectedAt).getTime()
      )
      .slice(0, 5);

  }

  get lowAlerts(): number {
  return this.alerts.filter(
    alert => alert.severity === 'LOW'
  ).length;
}

get mediumAlerts(): number {
  return this.alerts.filter(
    alert => alert.severity === 'MEDIUM'
  ).length;
}

get closedIncidents(): number {
  return this.incidents.filter(
    incident => incident.status === 'CLOSED'
  ).length;
}

get alertSeverityTotal(): number {
  return Math.max(
    this.totalAlerts,
    1
  );
}

get machineTotalForChart(): number {
  return Math.max(
    this.totalMachines,
    1
  );
}

get incidentTotalForChart(): number {
  return Math.max(
    this.totalIncidents,
    1
  );
}

}