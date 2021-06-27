import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indNumber',
})
export class IndNumberPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    if (!isNaN(value) && value != 0) {
      var result = value.toString().split('.');

      var lastThree = result[0].substring(result[0].length - 3);
      var otherNumbers = result[0].substring(0, result[0].length - 3);
      if (otherNumbers != '') lastThree = ',' + lastThree;
      var output =
        otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

      if (result.lenght > 1) {
        output += '.' + result[1];
      }

      return output;
    }
    return value;
  }
}
