import { Component, EventEmitter, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { User } from '../../interfaces/user';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-update-account',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf],
  templateUrl: './update-account.component.html',
  styleUrl: './update-account.component.css',
})
export class UpdateAccountComponent implements OnInit {
  @Input() user!: User;
  @Output() updateUser: EventEmitter<User> = new EventEmitter<User>();
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  loading: boolean = false;

  updateForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    dob: new FormControl(''),
    password: new FormControl(''),
    cPassword: new FormControl(''),
    oldPassword: new FormControl(''),
  });

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  closeUpdateForm(): void {
    this.close.emit(false);
  }

  updateUserParent(user: User): void {
    this.updateUser.emit(user);
  }

  update(): void {
    this.loading = true;

    const name = this.updateForm.value.name;
    const email = this.updateForm.value.email;
    const dob = this.updateForm.value.dob;
    const password = this.updateForm.value.password;
    const cPassword = this.updateForm.value.cPassword;
    const oldPassword = this.updateForm.value.oldPassword;

    if (!name && !email && !password && !oldPassword && !dob && !cPassword) {
      alert('Nothing to update');
      this.loading = false;
      return;
    }

    if (password !== cPassword) {
      alert('Password and confirm password must be the same.');
      this.loading = false;
      return;
    }

    if (password && !oldPassword) {
      alert('To update the password, you need to enter the old password');
      this.loading = false;
      return;
    }

    if (!password && oldPassword) {
      alert('Cannot input the old password alone and leave out the password');
      this.loading = false;
      return;
    }

    if (password) {
      if (
        password.length < 6 ||
        !/[A-Z]/.test(password) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(password)
      ) {
        alert(
          'Password must be at least 6 characters long, contain a capital letter, and a special character'
        );
        this.loading = false;
        return;
      }
    }

    type X = {
      name: string;
      email: string;
      dob: string;
      oldPassword?: string;
      password?: string;
    };
    const updateData: X = {
      name: String(name),
      email: String(email),
      dob: String(dob),
    };

    if (oldPassword && password) {
      updateData.oldPassword = oldPassword;
      updateData.password = password;
    }

    if (
      name === this.user.name &&
      email === this.user.email &&
      dob === this.user.dob &&
      !password &&
      !oldPassword
    ) {
      alert('Sorry but you did not perform any update.');
      this.loading = false;
      return;
    }
    this.authService.updateAccount(updateData).subscribe(
      (user) => {
        console.log(user.user);

        this.updateUserParent({
          ...this.user,
          name: user.user.name,
          email: user.user.email,
          dob: user.user.dob,
        });

        this.loading = false;
        this.closeUpdateForm();
      },
      (error) => {
        alert(error.error.message);
        console.log(error);
        this.loading = false;
      }
    );
  }
  // Diallo12345@gmail.com
  ngOnInit(): void {
    this.updateForm.setValue({
      name: this.user.name,
      email: this.user.email,
      dob: this.user.dob,
      password: '',
      cPassword: '',
      oldPassword: '',
    });
  }
}
