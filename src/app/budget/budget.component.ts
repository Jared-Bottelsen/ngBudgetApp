import { Component, OnInit } from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { BudgetAddComponent } from './budget-add/budget-add.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BudgetCategory } from './budget-add/budget-category.model';
import { BudgetSubcategory } from './budget-add/budget-subcategory.model';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  providers: [DialogService, DynamicDialogRef]
})
export class BudgetComponent implements OnInit {

  faPlusCircle = faPlusCircle

  testValue: number = 100;

  budgetAddModalOptions = {
    header: 'Add to Your Budget',
    width: '80%',
    height: '50%',
    styleClass: 'budget-add'  
  }

  budgetcategory: any = [];

  constructor(public dialogService: DialogService, public ref: DynamicDialogRef) { 

  }

  showModal() {
    const ref = this.dialogService.open(BudgetAddComponent, this.budgetAddModalOptions)
    
    ref.onClose.subscribe((category) => {
      if (category === undefined) {
        console.log('No form data sent');
      } else {
        this.budgetcategory.push(category)
      }
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.budgetcategory, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {
  }

}
