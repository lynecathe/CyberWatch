import { Component } from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

interface ConnectedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ANALYST' | 'ADMIN';
}

@Component({
  selector: 'app-main-layout',

  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {

  currentUser: ConnectedUser | null = null;

  constructor(
    private router: Router
  ) {
    this.loadCurrentUser();
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

  get isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  get isAnalyst(): boolean {
    return this.currentUser?.role === 'ANALYST';
  }

  get isUser(): boolean {
    return this.currentUser?.role === 'USER';
  }

  get canAccessSocFeatures(): boolean {
    return this.isAdmin || this.isAnalyst;
  }

  get initials(): string {

    if (!this.currentUser) {
      return 'CW';
    }

    const first =
      this.currentUser.firstName
        ?.charAt(0)
        .toUpperCase() ?? '';

    const last =
      this.currentUser.lastName
        ?.charAt(0)
        .toUpperCase() ?? '';

    return `${first}${last}`;
  }

  logout(): void {

    localStorage.removeItem('cyberwatch_token');
    localStorage.removeItem('cyberwatch_role');
    localStorage.removeItem('cyberwatch_user');

    this.router.navigate(['/login']);
  }
}