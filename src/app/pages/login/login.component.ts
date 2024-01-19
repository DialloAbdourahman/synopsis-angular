import { Component, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { Router } from '@angular/router';
import { interval, Observable } from 'rxjs';
import { takeWhile } from 'rxjs';
import { SimpleChanges } from '@angular/core';
import { NgIf } from '@angular/common';
import { CountDownComponent } from '../../components/count-down/count-down.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CountDownComponent, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loading: boolean = false;
  countdownValue: number = 0;

  loginForm = new FormGroup({
    login: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  updateCountDown($event: any): void {
    this.countdownValue = $event;
  }

  login(): void {
    this.loading = true;

    if (this.countdownValue > 0) {
      alert(`Please wait for the count down ${this.countdownValue}`);
      this.loading = false;
      return;
    }

    if (!this.loginForm.value.login || !this.loginForm.value.password) {
      alert('Please enter login and password');
      this.loading = false;
      return;
    }

    this.authService
      .login(this.loginForm.value.login, this.loginForm.value.password)
      .subscribe(
        (user) => {
          this.loading = false;
          this.router.navigate(['/home']);
          // console.log('Login', user);
        },
        (error) => {
          this.loading = false;
          if (error.error.blocked) {
            this.countdownValue = error.error.time;
          }
          alert(error.error.message);
          console.log('oops', error.error);
        }
      );
  }
}
