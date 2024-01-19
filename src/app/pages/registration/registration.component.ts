import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
  loading: boolean = false;
  registerForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    dob: new FormControl(''),
    login: new FormControl(''),
    password: new FormControl(''),
    password2: new FormControl(''),
  });

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  register(): void {
    this.loading = true;

    if (
      !this.registerForm.value.name ||
      !this.registerForm.value.email ||
      !this.registerForm.value.dob ||
      !this.registerForm.value.login ||
      !this.registerForm.value.password ||
      !this.registerForm.value.password2
    ) {
      alert('Please enter all fields');
      this.loading = false;
      return;
    }

    if (
      this.registerForm.value.password.length < 6 ||
      !/[A-Z]/.test(this.registerForm.value.password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(this.registerForm.value.password)
    ) {
      alert(
        'Password must be at least 6 characters long, contain a capital letter, and a special character'
      );
      this.loading = false;
      return;
    }

    if (
      this.registerForm.value.password !== this.registerForm.value.password2
    ) {
      alert('Passwords should match');
      this.loading = false;
      return;
    }

    this.authService
      .register(
        this.registerForm.value.name,
        this.registerForm.value.email,
        this.registerForm.value.dob,
        this.registerForm.value.login,
        this.registerForm.value.password
      )
      .subscribe(
        () => {
          this.router.navigate(['/login']);
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          if (error.error.message) {
            alert(error.error.message);
          } else {
            alert('Something went wrong');
          }
        }
      );
  }
}
