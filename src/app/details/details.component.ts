import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyService } from '../currency.service';
import { ConverterComponent } from '../converter/converter.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    ConverterComponent,
    RouterLink
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  fromCurrency: string = '';
  toCurrency: string = '';
  historicalData: any = {};
  popularConversions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private currencyService: CurrencyService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.fromCurrency = params['from'];
      this.toCurrency = params['to'] || 'EUR'; // Default to EUR if 'to' is not provided
      this.loadData();
    });
  }

  loadData() {
    this.currencyService.getHistoricalData(this.fromCurrency, this.toCurrency).subscribe(
      data => this.historicalData = data
    );
    this.currencyService.getPopularConversions(this.fromCurrency).subscribe(
      data => this.popularConversions = data
    );
  }
}
