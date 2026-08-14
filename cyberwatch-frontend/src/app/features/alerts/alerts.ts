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
  IncidentService
} from '../../core/services/incident';

@Component({
  selector: 'app-alerts',
  imports: [CommonModule],
  templateUrl: './alerts.html',
  styleUrl: './alerts.scss'
})
export class Alerts implements OnInit {

  alerts: SecurityAlert[] = [];
  loading = true;
  errorMessage = '';

  incidentAlertIds = new Set<number>();

  filter:
    'ALL' |
    'NEW' |
    'INVESTIGATING' |
    'RESOLVED' |
    'HIGH' |
    'CRITICAL' = 'ALL';

  constructor(
    private alertService: AlertService,
    private incidentService: IncidentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAlerts();
    this.loadExistingIncidents();
  }

  loadAlerts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.alertService.getAllAlerts().subscribe({
      next: (alerts) => {
        console.log('ALERTS RECEIVED', alerts);

        this.alerts = alerts;
        this.loading = false;

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error(error);

        this.errorMessage = 'Unable to load security alerts.';
        this.loading = false;

        this.cdr.markForCheck();
      }
    });
  }

  loadExistingIncidents(): void {

    this.incidentService.getAllIncidents().subscribe({
      next: (incidents) => {

        this.incidentAlertIds = new Set(
          incidents
            .filter(incident => incident.alert?.id != null)
            .map(incident => incident.alert!.id)
        );

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error(
          'Unable to load existing incidents',
          error
        );
      }
    });
  }

  changeStatus(
    alert: SecurityAlert,
    status: 'NEW' | 'INVESTIGATING' | 'RESOLVED'
  ): void {

    this.alertService.updateStatus(alert.id, status).subscribe({
      next: (updatedAlert) => {

        const index = this.alerts.findIndex(
          item => item.id === updatedAlert.id
        );

        if (index !== -1) {
          this.alerts[index] = updatedAlert;
        }

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error(error);

        this.errorMessage = 'Unable to update alert status.';
        this.cdr.markForCheck();
      }
    });
  }

  createIncident(alert: SecurityAlert): void {

    this.errorMessage = '';

    this.incidentService
      .createFromAlert(alert.id)
      .subscribe({

        next: (incident) => {

          console.log('INCIDENT CREATED', incident);

          this.incidentAlertIds.add(alert.id);

          this.cdr.markForCheck();
        },

        error: (error) => {

          console.error(error);

          if (error.status === 409) {

            this.errorMessage =
              error.error?.message ??
              'An incident already exists for this alert.';

            this.incidentAlertIds.add(alert.id);

          } else {

            this.errorMessage =
              'Unable to create incident from this alert.';
          }

          this.cdr.markForCheck();
        }
      });
  }

  get filteredAlerts(): SecurityAlert[] {

    if (this.filter === 'ALL') {
      return this.alerts;
    }

    if (
      this.filter === 'HIGH' ||
      this.filter === 'CRITICAL'
    ) {
      return this.alerts.filter(
        alert => alert.severity === this.filter
      );
    }

    return this.alerts.filter(
      alert => alert.status === this.filter
    );
  }

  setFilter(
    filter:
      'ALL' |
      'NEW' |
      'INVESTIGATING' |
      'RESOLVED' |
      'HIGH' |
      'CRITICAL'
  ): void {
    this.filter = filter;
  }
}