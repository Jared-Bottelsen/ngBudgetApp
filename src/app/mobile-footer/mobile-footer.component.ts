import { Component, OnInit } from '@angular/core';
import { faReceipt, faWallet, faChartPie, faBalanceScale, faPlusCircle, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-mobile-footer',
  templateUrl: './mobile-footer.component.html',
  styleUrls: ['./mobile-footer.component.scss']
})
export class MobileFooterComponent implements OnInit {
  faPlusCircle = faPlusCircle;
  faReceipt = faReceipt;
  faWallet = faWallet;
  faChartPie = faChartPie;
  faBalanceScale = faBalanceScale;
  faPlusSquare = faPlusSquare;

  isActiveLink: string = 'overview'

  changeActiveLink() {
    if (this.isActiveLink === 'overview') {
      this.isActiveLink = 'budget'
    } else {
      this.isActiveLink = 'overview'
    }
  }
  
  constructor() { }

  ngOnInit(): void {
  }

}