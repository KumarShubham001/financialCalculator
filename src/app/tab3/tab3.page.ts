import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IndNumberPipe } from './../shared/reusable/pipes/ind-number.pipe';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page {
  userForm: FormGroup;
  contentLoaded: boolean;
  homePrice: number;
  url: string;
  installmentPeriod: number;
  defaultInstallmentPeriod: number = 15;
  downPaymentError: boolean = false;
  homeError: boolean = false;

  constructor(private fb: FormBuilder, private ls: LoaderService) {}

  ngOnInit() {
    this.contentLoaded = false;
    this.installmentPeriod = this.defaultInstallmentPeriod;

    this.userForm = this.fb.group({
      grossSalary: ['750000', Validators.required],
      downpayment: ['300000', Validators.required],
      homePrice: [''],
    });

    this.userForm.valueChanges.subscribe(() => {
      this.contentLoaded = false;
    });
  }

  formatNumber(e) {
    const indNumber = new IndNumberPipe();

    e.target.type = 'text';
    e.target.value = indNumber.transform(e.target.value);
  }

  transformNumber(e) {
    let formatedValue = e.target.value;
    formatedValue = String(formatedValue).split(',').join('');

    e.target.type = 'number';
    e.target.value = formatedValue;
  }

  formatText(e) {
    const indNumber = new IndNumberPipe();
    let value = e.target.value;

    e.target.value = indNumber.transform(value);
  }

  analyze(e: FormGroup) {
    this.ls.startDataLoader();

    this.contentLoaded = false;
    this.homeError = false;
    this.downPaymentError = false;

    const rawData = e.getRawValue();

    Object.keys(rawData).forEach((key) => {
      rawData[key] = String(rawData[key]).split(',').join('');
    });

    let monthlyInstallment = ((Number(rawData.grossSalary) / 12) * 30) / 100;
    let maxFinanced = monthlyInstallment * 12 * Number(this.installmentPeriod);

    this.homePrice = Number(maxFinanced) + Number(rawData.downpayment);

    if (rawData.homePrice) {
      if (
        Number(rawData.downpayment) >=
        (Number(rawData.homePrice) * 30) / 100
      ) {
        this.downPaymentError = false;
      } else {
        this.downPaymentError = true;
      }

      if (
        Number(rawData.homePrice) <= this.homePrice ||
        Number(rawData.homePrice) > Number(rawData.grossSalary) * 3
      ) {
        this.homeError = false;
      } else {
        this.homeError = true;
      }
    }
    setTimeout(() => {
      this.contentLoaded = true;
      this.ls.stopDataLoader();
    }, 1000);
  }

  // updatehomePrice(e) {
  //   const rawData = this.userForm.getRawValue();

  //   Object.keys(rawData).forEach((key) => {
  //     rawData[key] = String(rawData[key]).split(',').join('');
  //   });

  //   this.installmentPeriod = Number(e.detail.value);

  //   let monthlyInstallment = (Number(rawData.grossSalary) * 10) / 100 / 12;
  //   let maxFinanced = monthlyInstallment * 12 * Number(this.installmentPeriod);

  //   this.homePrice = Math.round(
  //     Number(maxFinanced) + Number(rawData.downpayment)
  //   );

  //   if (rawData.homePrice) {
  //     if (
  //       Number(rawData.downpayment) >=
  //       (Number(rawData.homePrice) * 20) / 100
  //     ) {
  //       this.downPaymentError = false;
  //     } else {
  //       this.downPaymentError = true;
  //     }

  //     if (Number(rawData.homePrice) <= this.homePrice) {
  //       this.homeError = false;
  //     } else {
  //       this.homeError = true;
  //     }
  //   }
  // }

  doRefresh(event) {
    this.ngOnInit();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
