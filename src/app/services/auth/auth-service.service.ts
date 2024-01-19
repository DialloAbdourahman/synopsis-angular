import { Injectable } from '@angular/core';
import { User, UpdateUser } from '../../interfaces/user';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, map, tap, throwError, Observable } from 'rxjs';
import { History } from '../../interfaces/history';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private url: string = 'http://localhost:4000/api';

  user!: User | undefined;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.user?.accessToken}`,
    }),
  };

  constructor(private http: HttpClient) {}

  logout(): void {
    this.user = undefined;
  }

  login(login: string, password: string): Observable<User> {
    return this.http
      .post<User>(
        `${this.url}/user/login`,
        { login, password },
        this.httpOptions
      )
      .pipe(
        tap((user) => {
          this.user = user;
        })
      );
  }

  register(
    name: string,
    email: string,
    dob: string,
    login: string,
    password: string
  ): Observable<User> {
    return this.http
      .post<User>(
        `${this.url}/user/create_account`,
        { name, email, password, login, dob },
        this.httpOptions
      )
      .pipe();
  }

  getHistory(historyPage: number): Observable<History> {
    let header = new HttpHeaders().set(
      'Authorization',
      `${this.user?.accessToken}`
    );
    return this.http.get<History>(
      `${this.url}/user/login_history?page=${historyPage}`,
      { headers: header }
    );
  }

  updateAccount(data: {
    name: string;
    email: string;
    dob: string;
    password?: string;
    oldPassword?: string;
  }): Observable<UpdateUser> {
    let header = new HttpHeaders().set(
      'Authorization',
      `${this.user?.accessToken}`
    );
    return this.http.put<UpdateUser>(`${this.url}/user/update_account`, data, {
      headers: header,
    });
  }
}
