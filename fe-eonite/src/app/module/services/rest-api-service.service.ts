import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RestApiServiceService {
  apiURL = 'http://localhost:8081';
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Accept": "application/json"
  });
  constructor(private http: HttpClient) {

  }

  getCategory(): Observable<any>{
    return this.http.get(this.apiURL+'/public/category').pipe(retry(1), catchError(this.handleError));
  }

  getDomicile(): Observable<any>{
    return this.http.get(this.apiURL+'/public/domicile').pipe(retry(1), catchError(this.handleError));
  }

  postsignInUser(body: any): Observable<any>{
    return this.http.post(this.apiURL+'/auth/signupUser',body, {headers: this.headers});
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
