import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { SharedModule } from './../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    IonicModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
  ],
  declarations: [Tab1Page],
})
export class Tab1PageModule {}
