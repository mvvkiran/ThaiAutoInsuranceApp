import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';

@Pipe({
  name: 'thaiCurrency'
})
export class ThaiCurrencyPipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) {
      return '';
    }

    return this.translationService.formatCurrency(numValue);
  }
}