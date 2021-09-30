import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-budget-overview',
  templateUrl: './budget-overview.component.html',
  styleUrls: ['./budget-overview.component.scss']
})
export class BudgetOverviewComponent implements OnInit {

  faHandHoldingUsd = faHandHoldingUsd

  isMobile: boolean = this.deviceService.isMobile();

  isDesktop: boolean = this.deviceService.isDesktop();

  individualExpenses = [{
    expenseName: 'Pay Rent',
    expenseValue: 3500
  }, {
    expenseName: 'Get Groceries',
    expenseValue: 200
  }, {
    expenseName: 'Buy Car',
    expenseValue: 25000
  }, {
    expenseName: 'Pay Rent',
    expenseValue: 3500
  }, {
    expenseName: 'Get Groceries',
    expenseValue: 200
  }, {
    expenseName: 'Pay Rent',
    expenseValue: 3500
  }, {
    expenseName: 'Get Groceries',
    expenseValue: 200
  }, {
    expenseName: 'Buy Car',
    expenseValue: 25000
  }, {
    expenseName: 'Pay Rent',
    expenseValue: 3500
  }, {
    expenseName: 'Get Groceries',
    expenseValue: 200
  }]; 

  constructor(private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
  }

}
