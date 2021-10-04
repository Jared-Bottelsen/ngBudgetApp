import { Component, OnInit } from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { BudgetAddComponent } from './budget-add/budget-add.component';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  providers: [DialogService, DynamicDialogRef]
})
export class BudgetComponent implements OnInit {

  faPlusCircle = faPlusCircle

  testValue: number = 30;

  budgetAddModalOptions = {
    header: 'Add to Your Budget',
    width: '80%',
    height: '80%',
    styleClass: 'budget-add',
    closeOnEscape: true
  }

  constructor(public dialogService: DialogService, public ref: DynamicDialogRef) { 

  }

  showModal() {
    const ref = this.dialogService.open(BudgetAddComponent, this.budgetAddModalOptions)
  }

  ngOnInit(): void {
  }

}
