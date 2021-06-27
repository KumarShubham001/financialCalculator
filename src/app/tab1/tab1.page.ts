import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { BrowserTab } from '@ionic-native/browser-tab/ngx';

import { IndNumberPipe } from './../shared/reusable/pipes/ind-number.pipe';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  userForm: FormGroup;
  contentLoaded: boolean;
  carPrice: number;
  url: string;
  installmentPeriod: number;
  defaultInstallmentPeriod: number = 4;
  downPaymentError: boolean = false;
  carError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ls: LoaderService,
    private iab: InAppBrowser,
    private browserTab: BrowserTab
  ) {}

  ngOnInit() {
    this.contentLoaded = false;
    this.installmentPeriod = this.defaultInstallmentPeriod;

    this.userForm = this.fb.group({
      grossSalary: ['', Validators.required],
      downpayment: ['', Validators.required],
      carPrice: [''],
    });

    this.userForm.valueChanges.subscribe(() => {
      this.contentLoaded = false;
    });
  }

  createCustomBrowser() {
    let figures;
    if (this.carPrice < 100000) {
      this.url =
        'https://www.google.com/search?q=site%3Azigwheels.com+affordable+cars+under+' +
        String(this.carPrice) +
        '&rlz=1C1RLNS_enIN915IN915&sourceid=chrome&ie=UTF-8';
    } else if (this.carPrice >= 100000 && this.carPrice < 4000000) {
      figures = Math.round(this.carPrice / 100000);
      this.url =
        'https://www.zigwheels.com/newcars/cars-under-' + figures + '-lakhs';
    } else {
      this.url = 'https://www.zigwheels.com/newcars/cars-above-40-lakhs';
    }

    this.browserTab.isAvailable().then((isAvailable) => {
      console.log(isAvailable);
      if (isAvailable) {
        this.browserTab.openUrl(this.url);
      } else {
        // brower-tab is not working so create a web view inside app
        const browser = this.iab.create(this.url, '_self', {
          location: 'no',
        });
        browser.show();
        browser.on('loadstop').subscribe((event) => {
          // browser.insertCSS({ code: 'body{color: red;' });
        });
      }
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
    this.carError = false;
    this.downPaymentError = false;

    const rawData = e.getRawValue();

    Object.keys(rawData).forEach((key) => {
      rawData[key] = String(rawData[key]).split(',').join('');
    });

    let monthlyInstallment = (Number(rawData.grossSalary) * 10) / 100 / 12;
    let maxFinanced = monthlyInstallment * 12 * Number(this.installmentPeriod);

    this.carPrice = Number(maxFinanced) + Number(rawData.downpayment);

    if (rawData.carPrice) {
      if (
        Number(rawData.downpayment) >=
        (Number(rawData.carPrice) * 20) / 100
      ) {
        this.downPaymentError = false;
      } else {
        this.downPaymentError = true;
      }

      if (Number(rawData.carPrice) <= this.carPrice) {
        this.carError = false;
      } else {
        this.carError = true;
      }
    }
    setTimeout(() => {
      this.contentLoaded = true;
      this.ls.stopDataLoader();
    }, 1000);
  }

  updateCarPrice(e) {
    const rawData = this.userForm.getRawValue();

    Object.keys(rawData).forEach((key) => {
      rawData[key] = String(rawData[key]).split(',').join('');
    });

    this.installmentPeriod = Number(e.detail.value);

    let monthlyInstallment = (Number(rawData.grossSalary) * 10) / 100 / 12;
    let maxFinanced = monthlyInstallment * 12 * Number(this.installmentPeriod);

    this.carPrice = Math.round(
      Number(maxFinanced) + Number(rawData.downpayment)
    );

    if (rawData.carPrice) {
      if (
        Number(rawData.downpayment) >=
        (Number(rawData.carPrice) * 20) / 100
      ) {
        this.downPaymentError = false;
      } else {
        this.downPaymentError = true;
      }

      if (Number(rawData.carPrice) <= this.carPrice) {
        this.carError = false;
      } else {
        this.carError = true;
      }
    }
  }

  doRefresh(event) {
    this.ngOnInit();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
