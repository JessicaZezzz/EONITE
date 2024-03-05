import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/app/enviroment/environment';

@Injectable({
  providedIn: 'root'
})
export class RestApiServiceService {
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Accept": "application/json"
  });
  constructor(private http: HttpClient) {

  }

  getCategory(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/public/category`).pipe(retry(1), catchError(this.handleError));
  }

  getDomicile(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/public/domicile`).pipe(retry(1), catchError(this.handleError));
  }

  postsignInUser(body: any): Observable<any>{
    return this.http.post(`${environment.apiUrl}/auth/signupUser`,body, {headers: this.headers});
  }

  postsignInVendor(body: any): Observable<any>{
    return this.http.post(`${environment.apiUrl}/auth/signupVendor`,body, {headers: this.headers});
  }

  loginUser(body: any): Observable<any>{
    return this.http.post(`${environment.apiUrl}/auth/signinUser`,body, {headers: this.headers});
  }

  loginVendor(body: any): Observable<any>{
    return this.http.post(`${environment.apiUrl}/auth/signinVendor`,body, {headers: this.headers});
  }

  refreshToken(refreshToken: any): Observable<any>{
    let body :token = {};
    body.token = refreshToken;
    return this.http.post(`${environment.apiUrl}/auth/refresh`,JSON.stringify(body), {headers: this.headers});
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}

export class token{
  token?:string;
}
