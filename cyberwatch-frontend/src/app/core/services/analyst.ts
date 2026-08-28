import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Analyst {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ANALYST';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnalystService {

  private readonly apiUrl =
    'http://localhost:8080/api/users/analysts';

  constructor(
    private http: HttpClient
  ) {}

  getAllAnalysts(): Observable<Analyst[]> {
    return this.http.get<Analyst[]>(this.apiUrl);
  }
}