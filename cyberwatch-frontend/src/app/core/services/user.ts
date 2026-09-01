import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type UserRole = 'USER' | 'ANALYST' | 'ADMIN';

export interface AppUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl =
    'http://localhost:8080/api/users';

  constructor(
    private http: HttpClient
  ) {}

  getAllUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(
      this.apiUrl
    );
  }

  updateRole(
    userId: number,
    role: UserRole
  ): Observable<AppUser> {

    return this.http.patch<AppUser>(
      `${this.apiUrl}/${userId}/role`,
      null,
      {
        params: {
          role
        }
      }
    );
  }
}