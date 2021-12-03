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

  selectedOption: any;

  archiveSelectionForm: FormGroup;

  constructor(private db: FirebaseService, private fb: FormBuilder) {
    this.archiveSelectionForm = this.fb.group({
      archiveSelection: ''
    })
   }

  ngOnInit(): void {
    this.getArchiveSubscription$ = this.db.getBudgetArchive().subscribe(result => {
      result.forEach(final => {
        console.log(final);
        this.dropDownOptions.push(final);
      })
    })
  }

  ngOnDestroy() {
    this.getArchiveSubscription$.unsubscribe();
  }

  submitForm(formData: any) {
    this.selectedOption = formData.value.archiveSelection[0];
  }

}
