import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Machine {
  id: number;
  hostname: string;
  ipAddress: string;
  operatingSystem: string;
  status: 'ONLINE' | 'OFFLINE' | 'COMPROMISED';
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lastSeen: string;
}

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  private readonly apiUrl =
    'http://localhost:8080/api/machines';

  constructor(private http: HttpClient) {}

  getAllMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>(this.apiUrl);
  }

  updateStatus(
    id: number,
    status: 'ONLINE' | 'OFFLINE' | 'COMPROMISED'
  ): Observable<Machine> {

    return this.http.patch<Machine>(
      `${this.apiUrl}/${id}/status?status=${status}`,
      {}
    );
  }

  deleteMachine(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}