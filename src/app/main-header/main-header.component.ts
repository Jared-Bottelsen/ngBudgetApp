import { Component, OnInit } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { MenuItem } from 'primeng/api';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  faBars = faBars

  menuItems!: MenuItem[];

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.menuItems = [
      {label: 'Log Out', icon: 'pi pi-fw pi-user-minus', command: () => {
        this.signOut();
      }}
    ]
  }

  signOut() {
    this.auth.signOut();
  }

}
