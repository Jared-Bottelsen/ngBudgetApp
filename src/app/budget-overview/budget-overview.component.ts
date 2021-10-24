import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-budget-overview',
  templateUrl: './budget-overview.component.html',
  styleUrls: ['./budget-overview.component.scss']
})
export class BudgetOverviewComponent implements OnInit {

  faHandHoldingUsd = faHandHoldingUsd

  isMobile: boolean = this.deviceService.isMobile();

  isDesktop: boolean = this.deviceService.isDesktop();

  individualExpenses:any = []; 

  constructor(private deviceService: DeviceDetectorService, private db: FirebaseService) { }

  ngOnInit(): void {
    let expenseList = this.db.getExpenses();
    expenseList.subscribe((expenses) => {
      expenses.map((expenseList) => {
        this.individualExpenses.push(expenseList);
      })
    })
  }
}