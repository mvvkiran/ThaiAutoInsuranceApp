import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNationalId'
})
export class FormatNationalIdPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Format Thai National ID: 1-2345-67890-12-3
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length === 13) {
      return cleanValue.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, '$1-$2-$3-$4-$5');
    }
    return value;
  }
}