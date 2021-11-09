import { Component, OnInit, OnDestroy } from '@angular/core';
import { faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-budget-overview',
  templateUrl: './budget-overview.component.html',
  styleUrls: ['./budget-overview.component.scss']
})
export class BudgetOverviewComponent implements OnInit, OnDestroy {
  getExpensesObservable$!: Subscription;

  faHandHoldingUsd = faHandHoldingUsd

  isMobile: boolean = this.deviceService.isMobile();

  isDesktop: boolean = this.deviceService.isDesktop();

  individualExpenses:any = []; 

  constructor(private deviceService: DeviceDetectorService, private db: FirebaseService) { }

  ngOnInit(): void {
    this.getExpensesObservable$ = this.db.getExpenses()
    .subscribe((expenses) => {
      expenses.map((expenseList) => {
        this.individualExpenses.push(expenseList);
      })
    })
    this.db.createUser();
  }

  ngOnDestroy(): void {
    this.getExpensesObservable$.unsubscribe();
  }
}