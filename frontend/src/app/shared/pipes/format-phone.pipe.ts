import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPhone'
})
export class FormatPhonePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Format Thai phone: 012-345-6789
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length === 10) {
      return cleanValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return value;
  }
}