import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data: any = null;

  constructor(private http: HttpClient) {}

  // Fetch data from the backend if data is null, otherwise return the cached data
  getData(): Observable<any> {
    if (this.data) {
      // Return the cached data as an observable
      return of(this.data);
    } else {
      // Call the backend and cache the result
      return this.http.get<any>('your-backend-endpoint-url').pipe(
        tap(response => this.data = response)
      );
    }
  }
}
