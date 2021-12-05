import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-budget-archive',
  templateUrl: './budget-archive.component.html',
  styleUrls: ['./budget-archive.component.scss']
})
export class BudgetArchiveComponent implements OnInit, OnDestroy {

  getArchiveSubscription$!: Subscription;

  dropDownOptions: any = [];

  archiveSelected: any;

  archiveSelectionForm: FormGroup;

  menuSelectOptions: any;

  selectedButtonOption: string = 'expenses'

  constructor(private db: FirebaseService, private fb: FormBuilder) {
    this.archiveSelectionForm = this.fb.group({
      archiveSelection: ''
    })
    this.menuSelectOptions = [{
      label: "Expenses",
      value: "expenses"
    }, {
      label: "Budget",
      value: "budget"
    }]
   }

  ngOnInit(): void {
    this.getArchiveSubscription$ = this.db.getBudgetArchive().subscribe(result => {
      result.forEach(final => {
        this.dropDownOptions.push(final);
      })
    })
  }

  ngOnDestroy() {
    this.getArchiveSubscription$.unsubscribe();
  }

  submitForm(formData: any) {
    this.archiveSelected = formData.value.archiveSelection[0];
  }

}
