import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appThaiNationalId]'
})
export class ThaiNationalIdDirective {
  constructor(private elementRef: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    // Limit to 13 digits
    if (value.length > 13) {
      value = value.substring(0, 13);
    }
    
    // Format as 1-2345-67890-12-3
    if (value.length > 0) {
      if (value.length <= 1) {
        value = value;
      } else if (value.length <= 5) {
        value = value.substring(0, 1) + '-' + value.substring(1);
      } else if (value.length <= 10) {
        value = value.substring(0, 1) + '-' + value.substring(1, 5) + '-' + value.substring(5);
      } else if (value.length <= 12) {
        value = value.substring(0, 1) + '-' + value.substring(1, 5) + '-' + value.substring(5, 10) + '-' + value.substring(10);
      } else {
        value = value.substring(0, 1) + '-' + value.substring(1, 5) + '-' + value.substring(5, 10) + '-' + value.substring(10, 12) + '-' + value.substring(12);
      }
    }
    
    event.target.value = value;
  }
}