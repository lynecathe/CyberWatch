import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AssignedAnalyst {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Incident {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;
  createdAt: string;

  assignedAnalyst?: AssignedAnalyst | null;

  alert?: {
    id: number;
    title: string;
    source: string;
    destination: string;
    severity: string;
    status: string;
    createdAt: string;
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  private readonly apiUrl = 'http://localhost:8080/api/incidents';

  constructor(private http: HttpClient) {}

  getAllIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(this.apiUrl);
  }

  getIncidentById(
    incidentId: number
  ): Observable<Incident> {
    return this.http.get<Incident>(
      `${this.apiUrl}/${incidentId}`
    );
  }

  createFromAlert(
    alertId: number
  ): Observable<Incident> {
    return this.http.post<Incident>(
      `${this.apiUrl}/from-alert/${alertId}`,
      {}
    );
  }

  updateStatus(
    incidentId: number,
    status: string
  ): Observable<Incident> {
    return this.http.patch<Incident>(
      `${this.apiUrl}/${incidentId}/status?status=${status}`,
      {}
    );
  }

  assignAnalyst(
    incidentId: number,
    analystId: number
  ): Observable<Incident> {
    return this.http.put<Incident>(
      `${this.apiUrl}/${incidentId}/assign/${analystId}`,
      {}
    );
  }

  deleteIncident(
    incidentId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${incidentId}`
    );
  }
}