import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  IncidentService,
  Incident
} from '../../core/services/incident';

@Component({
  selector: 'app-incidents',
  imports: [CommonModule],
  templateUrl: './incidents.html',
  styleUrl: './incidents.scss'
})
export class Incidents implements OnInit {

  incidents: Incident[] = [];
  loading = true;
  errorMessage = '';

  filter:
    'ALL' |
    'OPEN' |
    'INVESTIGATING' |
    'RESOLVED' |
    'CLOSED' = 'ALL';

  constructor(
    private incidentService: IncidentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents(): void {
    this.loading = true;
    this.errorMessage = '';

    this.incidentService.getAllIncidents().subscribe({
      next: (incidents) => {
        this.incidents = incidents;
        this.loading = false;

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error(error);

        this.errorMessage = 'Unable to load incidents.';
        this.loading = false;

        this.cdr.markForCheck();
      }
    });
  }

  changeStatus(
    incident: Incident,
    status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED'
  ): void {

    this.incidentService
      .updateStatus(incident.id, status)
      .subscribe({

        next: (updatedIncident) => {

          const index = this.incidents.findIndex(
            item => item.id === updatedIncident.id
          );

          if (index !== -1) {
            this.incidents[index] = updatedIncident;
          }

          this.cdr.markForCheck();
        },

        error: (error) => {
          console.error(error);

          this.errorMessage =
            'Unable to update incident status.';

          this.cdr.markForCheck();
        }
      });
  }

  get filteredIncidents(): Incident[] {

    if (this.filter === 'ALL') {
      return this.incidents;
    }

    return this.incidents.filter(
      incident => incident.status === this.filter
    );
  }

  setFilter(
    filter:
      'ALL' |
      'OPEN' |
      'INVESTIGATING' |
      'RESOLVED' |
      'CLOSED'
  ): void {
    this.filter = filter;
  }
}