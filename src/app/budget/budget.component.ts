import { Component, OnInit, OnDestroy } from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { BudgetAddComponent } from './budget-add/budget-add.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FirebaseService } from '../services/firebase.service';
import { BudgetEditComponent } from './budget-edit/budget-edit.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  providers: [DialogService, DynamicDialogRef]
})
export class BudgetComponent implements OnInit, OnDestroy {

  getBudgetSubscription$!: Subscription;

  faPlusCircle = faPlusCircle

  testValue: number = 100;

  isMenuVisible!: number;

  budgetCategory: any[] = [];

  budgetSubCategory: any[] = [];

  budgetAddModalOptions = {
    header: 'Add to Your Budget',
    width: '100%',
    height: '75%',
    styleClass: 'budget-add'  
  }

  constructor(public dialogService: DialogService, public ref: DynamicDialogRef, public db: FirebaseService) { 

  }

  openBudgetEditModal(index: number) {
    const ref = this.dialogService.open(BudgetEditComponent, {
      header: 'Make Edits to Your Budget',
      data: {
        categoryTitle: this.budgetCategory[index].categoryTitle,
        subCategories: this.budgetCategory[index].subCategory
      },
      width: '100%',
      height: '60%',
      styleClass: 'customDialogStyles',
      closable: false,
    });

    ref.onClose.subscribe((options) => {
      this.isMenuVisible = -1;
    })
  }

  showMenu(index: number) {
    this.isMenuVisible = index;
  }

  hideMenu() {
    this.isMenuVisible = -1;
  }

  private createSubCategoryObj(subCatArray: any[]) {
    for (let i = 0; i < subCatArray.length; i++) {
      subCatArray[i].startingValue = subCatArray[i].subCategoryValue
      this.budgetSubCategory.push(subCatArray[i])
    }
    return this.budgetSubCategory;
  }

  calcRemainingPercent(subCategories: any) {
    if(subCategories.startingValue === subCategories.subCategoryValue) {
      return 100;
    } else if (subCategories.startingValue !== subCategories.subCategoryValue && subCategories.subCategoryValue > 0) {
      let starting = parseInt(subCategories.startingValue);
      let remaining = parseInt(subCategories.subCategoryValue);
      let calc = (remaining / starting) * 100
      return calc
    } else {
      return 0
    }
  }

  showBudgetCategoryModal() {
    const ref = this.dialogService.open(BudgetAddComponent, this.budgetAddModalOptions)
    
    ref.onClose.subscribe((category) => {
      if (category === undefined) {
        console.log('No form data sent');
      } else {
        this.createSubCategoryObj(category.subCategory)
        this.budgetCategory.push({categoryTitle: category.categoryTitle, subCategory: this.budgetSubCategory});
        this.db.addCategory({categoryTitle: category.categoryTitle, subCategory: this.budgetSubCategory});
        console.log(this.budgetCategory);
      }
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.budgetCategory, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {
   this.getBudgetSubscription$ = this.db.getCategories()
    .subscribe((categories: any) => {
      this.budgetCategory = categories
    })
  }

  ngOnDestroy(): void {
    this.getBudgetSubscription$.unsubscribe();
  }
}