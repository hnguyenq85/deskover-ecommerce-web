import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError} from "rxjs/operators";
import {NotiflixUtils} from "@/utils/notiflix-utils";

@Injectable({
  providedIn: 'root'
})
export class RestApiService{
  constructor(private httpClient: HttpClient) {
  }

  get(link: string, params: HttpParams = null): Observable<any> {
    return this.httpClient.get(link, {params}).pipe(catchError(RestApiService.handleError));
  }

  getOne(link: string, id: any): Observable<any> {
    return this.httpClient.get(link + '/' + id).pipe(catchError(RestApiService.handleError));
  }

  post(link: string, body: any = {}, params: HttpParams = null, options: any = {}): Observable<any> {
    options.params = params;
    return this.httpClient.post(link, body, options).pipe(catchError(RestApiService.handleError));
  }

  put(link: string, body: any, params: HttpParams = null): Observable<any> {
    return this.httpClient.put(link, body, {params}).pipe(catchError(RestApiService.handleError));
  }

  delete(link: string, id: number) {
    return this.httpClient.delete(link + '/' + id).pipe(catchError(RestApiService.handleError));
  }

  uploadFile(link: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(link, formData);
  }

  private static handleError(error: any) {
    let errorMessage = 'Unknown error!';
    if (error instanceof HttpErrorResponse) {
      errorMessage = error.error.message;
      if (error.status === 0) {
        errorMessage = 'Máy chủ không phản hồi!';
      }
      if (error.status === 401) {

      }
    } else {
      errorMessage = `Error Code: ${error.status} - Message: ${error.message}`;
    }
    NotiflixUtils.failureNotify(errorMessage);
    return throwError(() => errorMessage);
  }
}
