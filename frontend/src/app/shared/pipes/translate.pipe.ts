import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private destroy$ = new Subject<void>();
  private lastKey: string = '';
  private lastValue: string = '';

  constructor(private translationService: TranslationService) {
    // Subscribe to language changes to trigger updates
    this.translationService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.lastKey = ''; // Reset to trigger retranslation
      });
  }

  transform(key: string, params?: { [key: string]: any }): string {
    if (!key) return '';

    // Check if we need to retranslate
    const cacheKey = key + JSON.stringify(params || {});
    if (this.lastKey !== cacheKey) {
      this.lastKey = cacheKey;
      this.lastValue = this.translationService.translate(key, params);
    }

    return this.lastValue;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}