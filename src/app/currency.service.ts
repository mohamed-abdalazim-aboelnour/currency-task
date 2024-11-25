import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private apiKey = 'fb884121b7778f6f603713d7fe356cc3';
  private baseUrl = 'http://data.fixer.io/api';

  constructor(private http: HttpClient) {}

  getCurrencies(): Observable<string[]> {
    return this.http.get<any>(`${this.baseUrl}/symbols?access_key=${this.apiKey}`).pipe(
      map(response => Object.keys(response.symbols))
    );
  }

  convertCurrency(amount: number, from: string, to: string): Observable<number> {
    return this.http.get<any>(`${this.baseUrl}/convert?access_key=${this.apiKey}&from=${from}&to=${to}&amount=${amount}`).pipe(
      map(response => response.result)
    );
  }

  getHistoricalData(from: string, to: string): Observable<any> {
    const today = new Date();
    const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()).toISOString().split('T')[0];
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()).toISOString().split('T')[0];
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).toISOString().split('T')[0];

    return this.http.get<any>(`${this.baseUrl}/timeseries?access_key=${this.apiKey}&start_date=${lastYear}&end_date=${yesterday}&base=${from}&symbols=${to}`).pipe(
      map(response => ({
        lastYear: response.rates[lastYear][to],
        lastMonth: response.rates[lastMonth][to],
        yesterday: response.rates[yesterday][to]
      }))
    );
  }

  getPopularConversions(from: string): Observable<any[]> {
    const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];
    return this.http.get<any>(`${this.baseUrl}/latest?access_key=${this.apiKey}&base=${from}&symbols=${popularCurrencies.join(',')}`).pipe(
      map(response => Object.entries(response.rates).map(([currency, rate]) => ({ currency, rate })))
    );
  }
}
