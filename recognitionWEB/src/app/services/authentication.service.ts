import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
  ) {
    firebase.auth().languageCode = 'es';
  }

  logIn(email:string, password:string){
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential:any) => {
      // Signed in
      var user = userCredential.user;
      localStorage.setItem("token",user.za);
      localStorage.setItem("uid",user.uid);
      this.router.navigate(['']);
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  }

  logInWithGoogle(){
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((data:any) => {
      var user = data.user;
      localStorage.setItem("token",user.za);
      localStorage.setItem("uid",user.uid);
      this.router.navigate(['']);
    });
  }

  logOut(){
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      localStorage.removeItem("token");
      localStorage.removeItem("uid");
      this.router.navigate(['login']);
    }).catch((error) => {
      // An error happened.
    });
  }

  refreshToken(){
    firebase.auth().currentUser.getIdToken(true)
    .then((idToken) => {
      localStorage.setItem('token',idToken);
    }).catch(function(error) {
    });
  }

}
