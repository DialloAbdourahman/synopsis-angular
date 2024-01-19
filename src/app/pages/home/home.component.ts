import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { User } from '../../interfaces/user';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { SingleHistory } from '../../interfaces/history';
import { UpdateAccountComponent } from '../../components/update-account/update-account.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor, UpdateAccountComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  user!: User | undefined;
  loading: boolean = false;
  history: SingleHistory[] = [];
  historyPage: number = 1;
  historyPages: number = 1;
  updateAccount: boolean = false;

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  openUpdate(): void {
    this.updateAccount = true;
  }

  logout(): void {
    this.authService.logout();
    this.user = undefined;
    this.router.navigate(['/login']);
  }

  next(): void {
    this.loading = true;

    if (this.historyPage + 1 > this.historyPages) {
      this.historyPage = 1;
      this.authService.getHistory(this.historyPage).subscribe(
        (data) => {
          this.history = data.history;
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.historyPage += 1;
      this.authService.getHistory(this.historyPage).subscribe(
        (data) => {
          this.history = data.history;
        },
        (error) => {
          console.log(error);
        }
      );
    }
    this.loading = false;
  }

  prev(): void {
    this.loading = true;

    if (this.historyPage - 1 === 0) {
      this.historyPage = this.historyPages;
      this.authService.getHistory(this.historyPage).subscribe(
        (data) => {
          this.history = data.history;
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.historyPage -= 1;
      this.authService.getHistory(this.historyPage).subscribe(
        (data) => {
          this.history = data.history;
        },
        (error) => {
          console.log(error);
        }
      );
    }
    this.loading = false;
  }

  close($event: any): void {
    this.updateAccount = false;
  }

  updateAccountInfo($event: User): void {
    this.user = $event;
  }

  ngOnInit(): void {
    if (this.authService.user) {
      this.user = this.authService.user;
    } else {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.authService.getHistory(this.historyPage).subscribe(
      (data) => {
        console.log(data);
        this.historyPages = data.count;
        this.history = data.history;
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
  }
}
