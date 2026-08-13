import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SecurityAlert {
  id: number;
  title: string;
  description: string;
  sourceIp: string;
  destinationIp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'NEW' | 'INVESTIGATING' | 'RESOLVED';
  detectedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private readonly apiUrl = 'http://localhost:8080/api/alerts';

  constructor(private http: HttpClient) {}

  getAllAlerts(): Observable<SecurityAlert[]> {
    return this.http.get<SecurityAlert[]>(this.apiUrl);
  }
}