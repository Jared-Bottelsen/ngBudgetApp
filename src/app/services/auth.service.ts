import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLoggedIn: boolean = false;
  public userId!: string;
  public displayName: any;

  constructor(private afAuth: AngularFireAuth, private router: Router) { 
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.isLoggedIn = true
        this.router.navigate(['/overview'])
        this.userId = user.uid;
        this.displayName = user.displayName;
      } else {
        this.isLoggedIn = false;
      }
    })
  }

  googleLogin() {
    if (!this.isLoggedIn) {
      this.afAuth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
      // this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } else {
      this.router.navigate(['/overview']);
    }
  }

  signOut() {
    this.afAuth.signOut()
    this.router.navigate(['/'])
  }
}
