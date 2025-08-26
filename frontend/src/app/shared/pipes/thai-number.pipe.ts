import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thaiNumber'
})
export class ThaiNumberPipe implements PipeTransform {
  transform(value: any): string {
    return value ? Number(value).toLocaleString('th-TH') : '';
  }
}