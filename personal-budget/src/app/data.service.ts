import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface BudgetItem {
  title: string;
  budget: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private budgetData: BudgetItem[] = [
    { title: "Eat out", budget: 25 },
    { title: "Rent", budget: 275 },
    { title: "Grocery", budget: 110 },
    { title: "Utilities", budget: 100 },
    { title: "Subscriptions", budget: 61 },
    { title: "Travel", budget: 79 },
    { title: "Mortgage", budget: 137 }
  ];

  constructor(private http: HttpClient) {}

  getBudgetData(): Observable<BudgetItem[]> {
    // Only make the HTTP call if the budgetData array is empty
    if (this.budgetData.length === 0) {
      return this.http.get<BudgetItem[]>('assets')
        .pipe(tap(data => this.budgetData = data));
    } else {
      return of(this.budgetData);
    }
  }
}
