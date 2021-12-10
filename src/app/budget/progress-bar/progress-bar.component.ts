import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

@Input('value') inputValue: number = 0;

conditionGreen: boolean = false;

conditionYellow: boolean = false;

conditionRed: boolean = false;

  constructor() { 
  }

  ngOnInit(): void {
    this.checkStatusValue();
  }

  checkStatusValue() {
    if (this.inputValue <= 100 && this.inputValue > 50) {
      this.conditionGreen = true;
    } else if (this.inputValue <= 50 && this.inputValue > 25) {
      this.conditionYellow = true 
    } else {
      this.conditionRed = true;
    }
  }

}
