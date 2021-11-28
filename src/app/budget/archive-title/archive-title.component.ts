import { Component, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-archive-title',
  templateUrl: './archive-title.component.html',
  styleUrls: ['./archive-title.component.scss']
})
export class ArchiveTitleComponent implements OnInit {

  faTimes = faTimes;

  selectedYes: boolean = false;

  archiveTitleForm: FormGroup;

  constructor(private ref: DynamicDialogRef, private fb: FormBuilder) { 
    this.archiveTitleForm = this.fb.group({
      budgetName: ''
    })
  }

  ngOnInit(): void {
  }

  closeModal() {
    this.ref.close();
  }

  selectYes() {
    this.selectedYes = true;
  }

  submitForm(formData: FormData) {
    this.ref.close(formData)
  }

}
