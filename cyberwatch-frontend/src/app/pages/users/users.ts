import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  AppUser,
  UserRole,
  UserService
} from '../../core/services/user';

interface ConnectedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users {

  users: AppUser[] = [];

  currentUser: ConnectedUser | null = null;

  loading = false;
  errorMessage = '';
  successMessage = '';

  updatingUserId: number | null = null;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadCurrentUser();
    this.loadUsers();
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

  loadUsers(): void {

    this.loading = true;
    this.errorMessage = '';

    this.userService
      .getAllUsers()
      .subscribe({

        next: (users) => {
          this.users = users;
          this.loading = false;
          this.cdr.markForCheck();
        },

        error: (error) => {
          console.error(error);

          this.errorMessage =
            'Unable to load users.';

          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  changeRole(
    user: AppUser,
    role: UserRole
  ): void {

    if (user.role === role) {
      return;
    }

    if (
      this.isCurrentAdmin(user) &&
      role !== 'ADMIN'
    ) {
      this.errorMessage =
        'You cannot remove your own ADMIN role.';

      this.cdr.markForCheck();
      return;
    }

    this.updatingUserId = user.id;

    this.errorMessage = '';
    this.successMessage = '';

    this.userService
      .updateRole(user.id, role)
      .subscribe({

        next: (updatedUser) => {

          this.users = this.users.map(
            currentUser =>
              currentUser.id === updatedUser.id
                ? updatedUser
                : currentUser
          );

          this.updatingUserId = null;

          this.successMessage =
            `${updatedUser.firstName} ${updatedUser.lastName} is now ${updatedUser.role}.`;

          this.cdr.markForCheck();
        },

        error: (error) => {
          console.error(error);

          this.errorMessage =
            error?.error?.message ??
            'Unable to update user role.';

          this.updatingUserId = null;

          this.loadUsers();
          this.cdr.markForCheck();
        }
      });
  }

  isCurrentAdmin(user: AppUser): boolean {

    return (
      this.currentUser !== null &&
      this.currentUser.id === user.id &&
      user.role === 'ADMIN'
    );
  }

  getInitials(user: AppUser): string {

    const first =
      user.firstName
        ?.charAt(0)
        .toUpperCase() ?? '';

    const last =
      user.lastName
        ?.charAt(0)
        .toUpperCase() ?? '';

    return `${first}${last}`;
  }
}