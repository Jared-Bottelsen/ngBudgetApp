import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-budget-archive',
  templateUrl: './budget-archive.component.html',
  styleUrls: ['./budget-archive.component.scss'],
  providers: [ConfirmationService]
})
export class BudgetArchiveComponent implements OnInit, OnDestroy {

  faTimes = faTimes;

  getArchiveSubscription$!: Subscription;

  dropDownOptions: any = [];

  archiveSelected: any;

  archiveSelectionForm: FormGroup;

  menuSelectOptions: any;

  selectedButtonOption: string = 'expenses';

  overviewHeaderTitles: any[];

  expenseHeaderTitles: any[];

  budgetHeaderTitles: any[];

  constructor(private db: FirebaseService, private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService) {
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
    this.overviewHeaderTitles = [{ title: "Income" }, { title: "Budgeted" }, { title: "Spent" }];
    this.expenseHeaderTitles = [{ title: "Date" }, { title: "Category" }, { title: "Name" }, { title: "Amount" }];
    this.budgetHeaderTitles = [{ title: "Category Title" }, { title: "Starting Value" }, { title: "Ending Value" }, { title: "Total Spent" }];
   }

  ngOnInit(): void {
    this.getArchiveSubscription$ = this.db.getBudgetArchive().subscribe(result => {
      this.dropDownOptions = result;
    })
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnDestroy() {
    this.getArchiveSubscription$.unsubscribe();
  }

  submitForm(formData: any) {
    this.archiveSelected = formData.value.archiveSelection[0];
  }

  confirmArchiveDeletion(event: any) {
    this.confirmationService.confirm({
      target: event.target,
      message: "Are you sure you want to delete this archive entry? This operation cannot be undone",
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'popup-menu-buttons',
      rejectButtonStyleClass: 'popup-menu-buttons',
      defaultFocus: 'none',
      accept: () => {
        this.deleteSelectedArchive(this.archiveSelected);
      },
      reject: () => {
        this.confirmationService.close();
      }
    })
  }

  deleteSelectedArchive(selectedArchive: any) {
    this.db.deleteDocument(selectedArchive.docId, "budgetArchive");
    this.router.navigate([this.router.url]);
  }

}
