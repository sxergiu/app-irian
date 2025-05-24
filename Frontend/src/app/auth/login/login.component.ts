import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router, RouterLink} from '@angular/router';
import {MatTable, MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatError, MatInput} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {tap} from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    MatTableModule,
    MatError,
    MatFormFieldModule,
    MatIconModule,
    NgIf,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatIconButton,
    MatInput,
    MatButton
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  error = '';
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.loginForm.value).pipe(
      tap(token => {
        this.loading = false;
        if (token) {
          localStorage.setItem('token', token);
          this.router.navigate(['/dashboard']).then(
            success => {
              if (success) {
                console.log('Navigation succeeded!');
              } else {
                console.warn('Navigation failed!');
              }
            }
          ).catch(err => {
            console.error('Navigation error:', err);
          });
        } else {
          this.error = 'Login failed. Invalid response.';
        }
      })
    ).subscribe({
      error: () => {
        this.loading = false;
        this.error = 'Invalid credentials';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
