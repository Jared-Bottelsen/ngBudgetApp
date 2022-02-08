import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-realtime-overview',
  templateUrl: './realtime-overview.component.html',
  styleUrls: ['./realtime-overview.component.scss']
})
export class RealtimeOverviewComponent implements OnInit {

  @Input() subCategoryArray: any[] = [];

  overviewHeaderTitles: any[];

  constructor() { 
    this.overviewHeaderTitles = [{ title: "Category Title" }, { title: "Starting Value" }, { title: "Current Value" }, { title: "Total Spent" }];
  }

  ngOnInit(): void {
  }

}
