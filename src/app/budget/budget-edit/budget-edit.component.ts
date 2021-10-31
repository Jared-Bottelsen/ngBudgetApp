import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'; 

@Component({
  selector: 'app-budget-edit',
  templateUrl: './budget-edit.component.html',
  styleUrls: ['./budget-edit.component.scss']
})
export class BudgetEditComponent implements OnInit {

  test: any = []

  constructor(private dynamicDialog: DialogService, private ref: DynamicDialogRef, private config: DynamicDialogConfig) { 
    console.log(config.data);
  }

  onSubmit() {

  }

  ngOnInit(): void {
    this.test = this.config.data.subCategories
    console.log(this.test);
  }

}
