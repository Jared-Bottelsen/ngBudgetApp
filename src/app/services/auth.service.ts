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
        console.log(user.uid, this.isLoggedIn);
      } else {
        this.isLoggedIn = false;
        console.log('No user signed in', this.isLoggedIn);
      }
    })
  }

  googleLogin() {
    if (!this.isLoggedIn) {
      this.afAuth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
    } else {
      this.router.navigate(['/overview']);
    }
  }

  signOut() {
    this.afAuth.signOut()
    this.router.navigate(['/login'])
    console.log('No longer signed in');
  }
}
