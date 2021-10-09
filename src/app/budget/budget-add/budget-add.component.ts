import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-budget-add',
  templateUrl: './budget-add.component.html',
  styleUrls: ['./budget-add.component.scss']
})
export class BudgetAddComponent implements OnInit {

  budgetForm = this.fb.group({
    categoryTitle: '',
    subCategoryTitle: '',
    subCategoryValue: ''
  });

  constructor(private fb: FormBuilder, public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
  }
  ngOnInit(): void {
    this.budgetForm.valueChanges.subscribe(console.log)
  }

  onSubmit() {
    console.log(this.budgetForm);
    this.ref.close(this.budgetForm.value);
  }

}
