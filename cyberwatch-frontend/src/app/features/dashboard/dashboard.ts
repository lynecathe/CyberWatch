import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AlertService,
  SecurityAlert
} from '../../core/services/alert';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  alerts: SecurityAlert[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.alertService.getAllAlerts().subscribe({
      next: (alerts) => {
        this.alerts = alerts;
        this.loading = false;
      },

      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to load security alerts.';
        this.loading = false;
      }
    });
  }

  get totalAlerts(): number {
    return this.alerts.length;
  }

  get criticalAlerts(): number {
    return this.alerts.filter(
      alert => alert.severity === 'CRITICAL'
    ).length;
  }

  get highAlerts(): number {
    return this.alerts.filter(
      alert => alert.severity === 'HIGH'
    ).length;
  }

  get openAlerts(): number {
    return this.alerts.filter(
      alert => alert.status !== 'RESOLVED'
    ).length;
  }
}