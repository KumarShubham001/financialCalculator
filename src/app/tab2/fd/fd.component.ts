import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Title,
  Legend,
  LineController,
  PointElement,
  Filler,
  CategoryScale,
  LinearScale,
  LineElement,
} from 'chart.js';

import { IndNumberPipe } from './../../shared/reusable/pipes/ind-number.pipe';
import { LoaderService } from './../../services/loader.service';

Chart.register(
  DoughnutController,
  ArcElement,
  Tooltip,
  Title,
  Legend,
  LineController,
  PointElement,
  Filler,
  CategoryScale,
  LinearScale,
  LineElement
);

@Component({
  selector: 'app-fd',
  templateUrl: './fd.component.html',
  styleUrls: ['./fd.component.scss'],
})
export class FdComponent implements OnInit {
  segmentType: string;
  userForm: FormGroup;
  contentLoaded: boolean;

  maturityAmount: number;
  interestEarned: number;
  totalInvestment: number;

  investmentPeriod: number;
  defaultInvestmentPeriod: number = 5;

  interestRate: number;
  defaultInterestRate: number = 6.5;

  private doughnutChart: Chart;
  private lineChart: Chart;

  @ViewChild('lineCanvas') private lineCanvas: ElementRef;

  constructor(private fb: FormBuilder, private ls: LoaderService) {}

  ngOnInit(): void {
    this.segmentType = 'ci';
    this.contentLoaded = false;
    this.investmentPeriod = this.defaultInvestmentPeriod;
    this.interestRate = this.defaultInterestRate;

    this.userForm = this.fb.group({
      principal: ['', Validators.required],
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

  updateInvestmentPeriod(e) {
    this.investmentPeriod = Number(e.detail.value);
  }

  updateInterestRate(e) {
    this.interestRate = Number(e.detail.value);
  }

  // scrollToElement(elementId): void {
  //   document.getElementById(elementId).scrollIntoView({
  //     behavior: 'smooth',
  //     block: 'start',
  //     inline: 'nearest',
  //   });
  // }

  calculate(e: FormGroup) {
    // this.scrollToElement('result');
    this.ls.startDataLoader();
    this.contentLoaded = false;

    // compounding interval = 1 for annully, 2 for haf-yearly, 4 for quaterly
    const compoundingInterval = 1;

    const rawData = e.getRawValue();

    Object.keys(rawData).forEach((key) => {
      rawData[key] = String(rawData[key]).split(',').join('');
    });

    let amount = 0;
    let ci = 0;

    // a = p * ((1 + r / (100 * n)) ^ (n * t));
    // ci = a - p

    const p = rawData.principal,
      r = this.interestRate,
      n = compoundingInterval,
      t = this.investmentPeriod;
    amount = Math.round(p * Math.pow(1 + r / (100 * n), n * t));

    this.totalInvestment = p;
    this.maturityAmount = amount;
    this.interestEarned = this.maturityAmount - this.totalInvestment;

    setTimeout(() => {
      this.ls.stopDataLoader();
      this.contentLoaded = true;

      setTimeout(() => {
        this.generateChart(rawData.principal, compoundingInterval);
      }, 500);
    }, 1000);
  }

  generateChart(investment, n) {
    const interestDataArr = [0];
    const maturityDataArr = [0];
    const yearArr = [0];

    this.lineChart = null;
    this.doughnutChart = null;

    let tempAmount = investment;

    maturityDataArr.pop();
    maturityDataArr.push(Number(investment));
    for (let i = 0; i < this.investmentPeriod; i++) {
      yearArr.push(i + 1);

      tempAmount = Math.round(
        tempAmount * Math.pow(1 + this.interestRate / (100 * n), n * 1)
      );
      maturityDataArr.push(tempAmount);

      const ci = tempAmount - investment;
      interestDataArr.push(ci);
    }

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [...yearArr],
        datasets: [
          {
            label: 'Maturity Amount',
            fill: 'origin',
            backgroundColor: 'rgba(54, 162, 235,0.4)',
            borderColor: 'rgba(54, 162, 235,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(54, 162, 235,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(54, 162, 235,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            data: [...maturityDataArr],
            spanGaps: false,
          },
          {
            label: 'Interest Gained',
            fill: 'origin',
            backgroundColor: 'rgba(255, 99, 132,0.4)',
            borderColor: 'rgba(255, 99, 132,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(255, 99, 132,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(255, 99, 132,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            data: [...interestDataArr],
            spanGaps: false,
          },
        ],
      },
      options: {
        scales: {
          y: {
            display: false,
            stacked: false,
            beginAtZero: true,
          },
          x: {
            grid: {
              display: false,
            },
            title: {
              display: true,
              text: 'Years',
            },
          },
        },
      },
    });
  }
}
