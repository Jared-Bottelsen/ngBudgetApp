import { Component, OnInit } from '@angular/core';
import { faReceipt, faWallet, faChartPie, faBalanceScale } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-mobile-footer',
  templateUrl: './mobile-footer.component.html',
  styleUrls: ['./mobile-footer.component.scss']
})
export class MobileFooterComponent implements OnInit {

  faReceipt = faReceipt;
  faWallet = faWallet;
  faChartPie = faChartPie;
  faBalanceScale = faBalanceScale;
  
  constructor() { }

  ngOnInit(): void {
  }

}
