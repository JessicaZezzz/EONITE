import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { request } from 'http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, timeout } from 'rxjs/operators';
import { environment } from 'src/app/enviroment/environment';

@Injectable({
  providedIn: 'root'
})
export class RestApiServiceService {
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Accept": "application/json",
    'Authorization': `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`
  });

  constructor(private http: HttpClient) {}

  getCategory(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/public/categoryAll`).pipe(retry(1), catchError(this.handleError));
  }

  getDomicile(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/public/domicileAll`).pipe(retry(1), catchError(this.handleError));
  }

  getCategorybyId(id:number): Observable<any>{
    let params = new HttpParams().append('id',id);
    return this.http.get(`${environment.apiUrl}/public/category`,{params:params}).pipe(retry(1), catchError(this.handleError));
  }

  getcategoryVendorId(id:number): Observable<any>{
    let params = new HttpParams().append('id',id);
    return this.http.get(`${environment.apiUrl}/public/categoryVendor`,{params:params}).pipe(retry(1), catchError(this.handleError));
  }

  getDomicilebyId(id:number): Observable<any>{
    let params = new HttpParams().append('id',id);
    return this.http.get(`${environment.apiUrl}/public/domicile`,{params:params}).pipe(retry(1), catchError(this.handleError));
  }

  postsignInUser(body: any): Observable<any>{
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json"
    });
    return this.http.post(`${environment.apiUrl}/auth/signupUser`,body,{headers:headers});
  }

  postsignInVendor(body: any): Observable<any>{
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json"
    });
    return this.http.post(`${environment.apiUrl}/auth/signupVendor`,body,{headers:headers});
  }

  checkEmailVendor(email:string){
    return this.http.get(`${environment.apiUrl}/auth/checkEmailVendor/${email}`).pipe(retry(1), catchError(this.handleError));
  }

  checkEmailUser(email:string){
    return this.http.get(`${environment.apiUrl}/auth/checkEmailUser/${email}`).pipe(retry(1), catchError(this.handleError));
  }

  updateProfileVendor(body: any): Observable<any>{
    return this.http.put(`${environment.apiUrl}/vendor/updateProfileVendor`,body,{headers:this.headers});
  }

  updateProfileUser(body: any): Observable<any>{
    return this.http.put(`${environment.apiUrl}/user/updateProfile`,body,{headers:this.headers});
  }

  checkPasswordVendor(body: any): Observable<any>{
    return this.http.post(`${environment.apiUrl}/vendor/checkPasswordVendor`,body,{headers:this.headers});
  }

  checkPasswordUser(body: any): Observable<any>{
    return this.http.post(`${environment.apiUrl}/user/checkPassword`,body,{headers:this.headers});
  }

  changePasswordVendor(body: any): Observable<any>{
    return this.http.post(`${environment.apiUrl}/vendor/changePasswordVendor`,body,{headers:this.headers});
  }

  changePasswordUser(body: any): Observable<any>{
    return this.http.post(`${environment.apiUrl}/user/changePassword`,body,{headers:this.headers});
  }

  getprofileVendor(id:number){
    let params = new HttpParams().append('id',id);
    let path = `${environment.apiUrl}/public/vendorProfile`;
    const request = new HttpRequest('GET',path,{params:params})
    return this.http.request(request).pipe(timeout(200000));
  }

  getprofileUser(id:number){
    let params = new HttpParams().append('id',id);
    let path = `${environment.apiUrl}/user/userProfile`;
    const request = new HttpRequest('GET',path,{params:params,headers:this.headers})
    return this.http.request(request).pipe(timeout(200000));
  }

  getProductbyVendorId(id:number){
    let params = new HttpParams().append('id',id);
    let path = `${environment.apiUrl}/public/getProductbyVendorId`;
    const request = new HttpRequest('GET',path,{params:params})
    return this.http.request(request).pipe(timeout(200000));
  }

  getDetailProductById(id: number){
    let params = new HttpParams().append('id',id);
    let path = `${environment.apiUrl}/public/getProductbyId`;
    const request = new HttpRequest('GET',path,{params:params})
    return this.http.request(request).pipe(timeout(200000));
  }

  getAllVendor(param : HttpParams){
    let path = `${environment.apiUrl}/public/getallVendor`;
    const request = new HttpRequest('GET',path,{params:param})
    return this.http.request(request).pipe(timeout(200000));
  }

  getAllProduct(param : HttpParams){
    let path = `${environment.apiUrl}/public/getallProduct`;
    const request = new HttpRequest('GET',path,{params:param})
    return this.http.request(request).pipe(timeout(200000));
  }

  addProduct(body: any): Observable<any>{
    return this.http.post(`${environment.apiUrl}/vendor/addProduct`,body,{headers:this.headers});
  }

  updateProduct(body: any): Observable<any>{
    return this.http.put(`${environment.apiUrl}/vendor/updateProduct`,body,{headers:this.headers});
  }

  addCart(body: any): Observable<any>{
    return this.http.post(`${environment.apiUrl}/user/addCart`,body,{headers:this.headers});
  }

  updateCart(body: any): Observable<any>{
    return this.http.put(`${environment.apiUrl}/user/updateCart`,body,{headers:this.headers});
  }

  deleteCart(body: any): Observable<any>{
    return this.http.post(`${environment.apiUrl}/user/deleteCart`,body,{headers:this.headers});
  }

  getCart(id:number){
    let param = new HttpParams().append('id',id);
    let path = `${environment.apiUrl}/user/getCartbyId`;
    const request = new HttpRequest('GET',path,{params:param})
    return this.http.request(request).pipe(timeout(200000));
  }

  addBooking(body: any): Observable<any>{
    return this.http.post(`${environment.apiUrl}/trans/addTransaction`,body,{headers:this.headers});
  }

  getTransactionUser(id:number,state:string){
    let param = new HttpParams().append('id',id)
                                .append('state',state);
    let path = `${environment.apiUrl}/trans/getTransactionUsers`;
    const request = new HttpRequest('GET',path,{params:param})
    return this.http.request(request).pipe(timeout(200000));
  }

  getTransactionVendor(id:number,state:string){
    let param = new HttpParams().append('id',id)
                                .append('state',state);
    let path = `${environment.apiUrl}/trans/getTransactionVendor`;
    const request = new HttpRequest('GET',path,{params:param})
    return this.http.request(request).pipe(timeout(200000));
  }

  getDetailTransaction(id:number){
    let param = new HttpParams().append('id',id);
    let path = `${environment.apiUrl}/trans/getTransaction`;
    const request = new HttpRequest('GET',path,{params:param})
    return this.http.request(request).pipe(timeout(200000));
  }

  updateTransaction(body: any): Observable<any>{
    return this.http.put(`${environment.apiUrl}/trans/updateState`,body,{headers:this.headers});
  }

  updatePayment(body: any): Observable<any>{
    return this.http.put(`${environment.apiUrl}/trans/updatePayment`,body,{headers:this.headers});
  }

  addReview(body: any): Observable<any>{
    return this.http.post(`${environment.apiUrl}/public/addReview`,body,{headers:this.headers});
  }

  updateReview(body: any): Observable<any>{
    return this.http.put(`${environment.apiUrl}/public/updateProductReview`,body,{headers:this.headers});
  }

  getReview(id:number){
    let param = new HttpParams().append('id',id);
    let path = `${environment.apiUrl}/public/getAllProductReview`;
    const request = new HttpRequest('GET',path,{params:param})
    return this.http.request(request).pipe(timeout(200000));
  }

  getTop6Review(){
    let path = `${environment.apiUrl}/public/getProductReviewHome`;
    const request = new HttpRequest('GET',path)
    return this.http.request(request).pipe(timeout(200000));
  }

  countNewMessages(senderId:string,recipientId:string){
    let path = `${environment.chatUrl}/messages/${senderId}/${recipientId}/count`;
    const request = new HttpRequest('GET',path)
    return this.http.request(request).pipe(timeout(200000));
  }

  findChatMessages(senderId:number,recipientId:number,userType:string){
    let path = `${environment.chatUrl}/messages/${senderId}/${recipientId}/${userType}`;
    const request = new HttpRequest('GET',path)
    return this.http.request(request).pipe(timeout(200000));
  }

  findMessageVendor(id:number){
    let path = `${environment.chatUrl}/messages-vendor/${id}`;
    const request = new HttpRequest('GET',path)
    return this.http.request(request).pipe(timeout(200000));
  }

  findMessageUser(id:number){
    let path = `${environment.chatUrl}/messages-user/${id}`;
    const request = new HttpRequest('GET',path)
    return this.http.request(request).pipe(timeout(200000));
  }

  getChatRoom(senderId:number,recipientId:number){
    let path = `${environment.chatUrl}/chatroom/${senderId}/${recipientId}`;
    const request = new HttpRequest('GET',path)
    return this.http.request(request).pipe(timeout(200000));
  }

  getNotif(chatId:string){
    let path = `${environment.chatUrl}/notif/${chatId}`;
    const request = new HttpRequest('GET',path)
    return this.http.request(request).pipe(timeout(200000));
  }

  deleteChatRoom(senderId:number,recipientId:number){
    let path = `${environment.chatUrl}/delchatroom/${senderId}/${recipientId}`;
    const request = new HttpRequest('GET',path)
    return this.http.request(request).pipe(timeout(200000));
  }

  generateOTP(body: any): Observable<any>{
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json"
    });
    return this.http.post(`${environment.apiUrl}/auth/generate-otp`,body,{headers:headers});
  }

  generateOTPlogin(body: any): Observable<any>{
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json"
    });
    return this.http.post(`${environment.apiUrl}/auth/generate-otp-login`,body,{headers:headers});
  }

  checkOTP(body: any): Observable<any>{
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json"
    });
    return this.http.post(`${environment.apiUrl}/auth/check-otp`,body,{headers:headers});
  }

  resetPassword(body: any): Observable<any>{
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json"
    });
    return this.http.post(`${environment.apiUrl}/auth/reset-password`,body,{headers:headers});
  }

  loginUser(body: any): Observable<any>{
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json"
    });
    return this.http.post(`${environment.apiUrl}/auth/signinUser`,body,{headers:headers});
  }

  loginVendor(body: any): Observable<any>{
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json"
    });
    return this.http.post(`${environment.apiUrl}/auth/signinVendor`,body,{headers:headers});
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
