import { Component, OnInit } from '@angular/core';
import { faReceipt, faWallet, faChartPie, faBalanceScale, faPlusCircle, faPlusSquare, faBook } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-mobile-footer',
  templateUrl: './mobile-footer.component.html',
  styleUrls: ['./mobile-footer.component.scss']
})
export class MobileFooterComponent implements OnInit {
  faBook = faBook;
  faPlusCircle = faPlusCircle;
  faReceipt = faReceipt;
  faWallet = faWallet;
  faChartPie = faChartPie;
  faBalanceScale = faBalanceScale;
  faPlusSquare = faPlusSquare;
  
  constructor() { }

  ngOnInit(): void {
  }

}