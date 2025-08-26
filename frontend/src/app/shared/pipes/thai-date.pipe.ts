import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thaiDate'
})
export class ThaiDatePipe implements PipeTransform {
  transform(value: any): string {
    return value ? new Date(value).toLocaleDateString('th-TH') : '';
  }
}