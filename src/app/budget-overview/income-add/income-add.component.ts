import { Component, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

interface Option {
  optionName: string,
  optionCode: string
}

@Component({
  selector: 'app-income-add',
  templateUrl: './income-add.component.html',
  styleUrls: ['./income-add.component.scss']
})
export class IncomeAddComponent implements OnInit {

  faTimes = faTimes;  

  options!: Option[];

  selectedOption: string = 'MO';

  monthlyForm: FormGroup = this.fb.group({
    monthlyInput: ''
  });

  biWeeklyForm: FormGroup = this.fb.group({
    check1: '',
    check2: ''
  })

  constructor(private ref: DynamicDialogRef, private fb: FormBuilder, private db: FirebaseService) { 
    this.options = [
      {optionName: 'Monthly', optionCode: 'MO'},
      {optionName: 'BiWeekly', optionCode: 'BI'}
    ]
  }

  ngOnInit(): void {
    
  }

  submitForm(form: FormGroup) {
    if (form.value.monthlyInput) {
      this.db.addIncome({income: form.value.monthlyInput})
    } else if (form.value.check1 || form.value.check2) {
      let total = form.value.check1 + form.value.check2;
      this.db.addIncome({income: total});
    }
    this.biWeeklyForm.reset();
    this.monthlyForm.reset();
    this.closeModal();
  }

  closeModal() {
    this.ref.close();
  }

}
