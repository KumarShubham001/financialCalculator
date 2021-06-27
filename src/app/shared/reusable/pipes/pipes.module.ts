import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InrCurrencyPipe } from './inr-currency.pipe';
import { IndNumberPipe } from './ind-number.pipe';

@NgModule({
  declarations: [InrCurrencyPipe, IndNumberPipe],
  imports: [CommonModule],
  exports: [InrCurrencyPipe, IndNumberPipe],
})
export class PipesModule {}
