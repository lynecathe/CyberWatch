import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  firstName = '';
  lastName = '';
  email = '';
  password = '';

  loading = false;
  errorMessage = '';

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  register(): void {

    this.loading = true;
    this.errorMessage = '';

    this.authService.register({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      role: 'ANALYST'
    }).subscribe({

      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },

      error: (error) => {
        console.error(error);
        this.loading = false;
        this.errorMessage = 'Unable to create account.';
      }

    });
  }
}