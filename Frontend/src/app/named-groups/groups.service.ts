import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {GroupModel} from './domain/group.models';

@Injectable({
  providedIn: 'root'
})

export class GroupService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/group';

  getGroups(): Observable<GroupModel[]> {
    return this.http.get<GroupModel[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  uploadGroupFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/upload`, formData, {
      responseType: 'text'
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error || error.message;
    }

    return throwError(() => errorMessage);
  }
}
