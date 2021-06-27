import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReusableModule } from './reusable/reusable.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, ReusableModule],
  exports: [ReusableModule],
})
export class SharedModule {}
