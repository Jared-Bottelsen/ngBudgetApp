import { Component, OnInit } from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { BudgetAddComponent } from './budget-add/budget-add.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  providers: [DialogService, DynamicDialogRef]
})
export class BudgetComponent implements OnInit {

  faPlusCircle = faPlusCircle

  testValue: number = 100;

  budgetCategory: any[] = [];

  budgetAddModalOptions = {
    header: 'Add to Your Budget',
    width: '80%',
    height: '50%',
    styleClass: 'budget-add'  
  }

  constructor(public dialogService: DialogService, public ref: DynamicDialogRef, public db: FirebaseService) { 

  }

  showModal() {
    const ref = this.dialogService.open(BudgetAddComponent, this.budgetAddModalOptions)
    
    ref.onClose.subscribe((category) => {
      if (category === undefined) {
        console.log('No form data sent');
      } else {
        this.budgetCategory.push(category);
        this.db.addCategory(category);
        console.log(category);

      }
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.budgetCategory, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {
    this.db.getCategories()
    .subscribe((categories: any) => {
    })
  }
}