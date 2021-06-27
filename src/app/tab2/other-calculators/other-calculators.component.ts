import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IndNumberPipe } from './../../shared/reusable/pipes/ind-number.pipe';
import { LoaderService } from './../../services/loader.service';

@Component({
  selector: 'app-other-calculators',
  templateUrl: './other-calculators.component.html',
  styleUrls: ['./other-calculators.component.scss'],
})
export class OtherCalculatorsComponent implements OnInit {
  MATH: any = Math;

  TACalcForm: FormGroup;

  TAContentLoaded: boolean;
  doubleCalcContentLoaded: boolean;
  tripleCalcContentLoaded: boolean;

  maturityAmount: number;
  interestEarned: number;
  totalInvestment: number;

  investmentPeriod: number;
  defaultInvestmentPeriod: number = 5;

  interestRate: number;
  doubleCalcInterestRate: number;
  tripleCalcInterestRate: number;
  defaultInterestRate: number = 6.5;

  constructor(private fb: FormBuilder, private ls: LoaderService) {}

  ngOnInit(): void {
    this.TAContentLoaded = false;
    this.investmentPeriod = this.defaultInvestmentPeriod;

    this.interestRate = this.defaultInterestRate;
    this.doubleCalcInterestRate = this.defaultInterestRate;
    this.tripleCalcInterestRate = this.defaultInterestRate;

    this.TACalcForm = this.fb.group({
      amount: ['', Validators.required],
    });

    this.TACalcForm.valueChanges.subscribe(() => {
      this.TAContentLoaded = false;
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

  TACalculate(e: FormGroup) {
    // this.scrollToElement('result');
    this.ls.startDataLoader();
    this.TAContentLoaded = false;

    // compounding interval = 1 for annully, 2 for haf-yearly, 4 for quaterly
    const compoundingInterval = 1;

    const rawData = e.getRawValue();

    Object.keys(rawData).forEach((key) => {
      rawData[key] = String(rawData[key]).split(',').join('');
    });

    let p = 0;
    let ci = 0;

    // a = p * ((1 + r / (100 * n)) ^ (n * t));
    // ci = a - p

    const a = rawData.amount,
      r = this.interestRate,
      n = compoundingInterval,
      t = this.investmentPeriod;

    p = Math.round(a / Math.pow(1 + r / (100 * n), n * t));

    this.totalInvestment = p;
    this.maturityAmount = a;
    this.interestEarned = this.maturityAmount - this.totalInvestment;

    setTimeout(() => {
      this.ls.stopDataLoader();
      this.TAContentLoaded = true;
    }, 1000);
  }

  doubleCalcDuration: number;
  doubleCalculator() {
    this.ls.startDataLoader();
    this.doubleCalcContentLoaded = false;

    this.doubleCalcDuration = Math.round(72 / this.doubleCalcInterestRate);

    setTimeout(() => {
      this.ls.stopDataLoader();
      this.doubleCalcContentLoaded = true;
    }, 1000);
  }

  tripleCalcDuration: number;
  tripleCalculator() {
    this.ls.startDataLoader();
    this.tripleCalcContentLoaded = false;

    this.tripleCalcDuration = Math.round(115 / this.tripleCalcInterestRate);

    setTimeout(() => {
      this.ls.stopDataLoader();
      this.tripleCalcContentLoaded = true;
    }, 1000);
  }
}
