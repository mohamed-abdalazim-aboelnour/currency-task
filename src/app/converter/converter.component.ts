import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from '../currency.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss'
})
export class ConverterComponent implements OnInit {
  @Input() fromCurrency: string = 'USD';
  @Input() toCurrency: string = 'EGP';
  
  amount: number = 0;
  currencies: string[] = [];
  result: number | null = null;
  quickConversions: {amount: number, result: number}[] = [];
  reverseConversions: {amount: number, result: number}[] = [];
  quickAmounts: number[] = [1, 10, 100, 1000];

  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.currencyService.getCurrencies().subscribe(
      currencies => this.currencies = currencies
    );
    this.onCurrencyChange();
  }

  enableInputs() {
    if (this.amount > 0) {
      this.convert();
    }
  }

  swapCurrencies() {
    [this.fromCurrency, this.toCurrency] = [this.toCurrency, this.fromCurrency];
    this.onCurrencyChange();
  }

  convert() {
    this.currencyService.convertCurrency(this.amount, this.fromCurrency, this.toCurrency).subscribe(
      result => this.result = result
    );
  }

  onCurrencyChange() {
    this.quickConversions = [];
    this.reverseConversions = [];
    this.quickAmounts.forEach(amount => {
      this.currencyService.convertCurrency(amount, this.fromCurrency, this.toCurrency).subscribe(
        result => this.quickConversions.push({amount, result})
      );
      this.currencyService.convertCurrency(amount, this.toCurrency, this.fromCurrency).subscribe(
        result => this.reverseConversions.push({amount, result})
      );
    });
  }

}
