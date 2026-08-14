import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Incident {
  id: number;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
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

  updateStatus(
    id: number,
    status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED'
  ): Observable<Incident> {
    return this.http.patch<Incident>(
      `${this.apiUrl}/${id}/status?status=${status}`,
      {}
    );
  }
}