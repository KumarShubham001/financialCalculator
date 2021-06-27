import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { FdComponent } from './fd/fd.component';
import { CiComponent } from './ci/ci.component';
import { OtherCalculatorsComponent } from './other-calculators/other-calculators.component';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { SharedModule } from './../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [Tab2Page, FdComponent, CiComponent, OtherCalculatorsComponent],
})
export class Tab2PageModule {}
