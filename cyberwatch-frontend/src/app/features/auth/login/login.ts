import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink
} from '@angular/router';

import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  email = '';
  password = '';

  loading = false;
  errorMessage = '';

  constructor(
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  login(): void {

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({

      next: (response) => {

        localStorage.setItem(
          'cyberwatch_token',
          response.token
        );

        localStorage.setItem(
          'cyberwatch_role',
          response.role
        );

        localStorage.setItem(
          'cyberwatch_user',
          JSON.stringify({
            id: response.id,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            role: response.role
          })
        );

        this.loading = false;

        this.router.navigate(['/dashboard']);
      },

      error: (error) => {

        console.error(error);

        this.loading = false;

        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        } else {
          this.errorMessage = 'Unable to sign in. Please try again.';
        }

        this.cdr.markForCheck();
      }

    });
  }
}