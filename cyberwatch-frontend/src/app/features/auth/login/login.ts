import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [
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
    private router: Router
  ) {}

  login(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({

      next: async (user) => {
  console.log('LOGIN OK', user);

  this.loading = false;

  localStorage.setItem(
    'cyberwatch_user',
    JSON.stringify(user)
  );

  const navigated = await this.router.navigate(['/dashboard']);
  console.log('NAVIGATION RESULT', navigated);
},

      error: (error) => {
        console.error(error);
        this.loading = false;
        this.errorMessage = 'Invalid email or password.';
      }

    });
  }
}