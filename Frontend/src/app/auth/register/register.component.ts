import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../auth.service';
import {NgIf} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatError, MatInput, MatLabel} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {tap} from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    MatProgressSpinnerModule,
    RouterLink,
    NgIf,
    MatError,
    MatFormFieldModule,
    MatLabel,
    MatIconModule,
    ReactiveFormsModule,
    MatInput,
    MatIconButton,
    MatButton
  ],
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  error = '';
  success = '';
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword?.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const { confirmPassword, ...registerData } = this.registerForm.value;

    this.authService.register(registerData).pipe(
      tap(response => {
        this.loading = false;

        console.log('Registered user:', response);

        // Since backend returns only name and role, check for those
        if (response && response.name && response.role) {
          this.success = 'Registration successful! Please sign in.';
          setTimeout(() => {
            this.router.navigate(['/login']).then(
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
          }, 2000);
        } else {
          this.error = 'Registration failed. Invalid response from server.';
        }
      })
    ).subscribe({
      error: err => {
        this.loading = false;
        console.error('Registration error:', err);
        this.error = 'An error occurred. Please try again.';
      }
    });
  }


  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}

