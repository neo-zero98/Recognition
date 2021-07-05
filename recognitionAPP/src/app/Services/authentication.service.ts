import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import "@codetrix-studio/capacitor-google-auth";
import { Plugins } from '@capacitor/core';
import { ToastService } from './toast.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    public toast: ToastService,
    private apiService: ApiService
  ) {
    firebase.auth().languageCode = 'es';
  }

  //service authentication
registro(name:string, email:string, password:string){
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    this.updateProfile(name);
    this.verificacion();
    this.logIn(email,password);
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
  });
}

verificacion(){
  var user = firebase.auth().currentUser;
  user.sendEmailVerification().then(res => {
  }).catch(function(error) {
    console.log(error);
  });
}

logIn(email:string, password:string){
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential:any) => {
    // Signed in
    var user = userCredential.user;
    localStorage.setItem("token",user.za);
    localStorage.setItem("uid",user.uid);
    this.guardarUsuario(user);
    this.router.navigate(['']);
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}

logInWithGoogle(){
  Plugins.GoogleAuth.signIn().then(res => {
    var credential = firebase.auth.GoogleAuthProvider.credential(res.authentication.idToken);
    firebase.auth().signInWithCredential(credential).then( (data:any) => {
      var user = data.user;
      localStorage.setItem("token",user.za);
      localStorage.setItem("uid",user.uid);
      this.guardarUsuario(user);
      this.router.navigate(['']);
    }).catch(data=>console.log(data));
  },error=>console.log("error"));
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

usuarioExistente(){
  firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        console.log("el usuario esta authenticado",uid);
        // ...
      } else {
        console.log("no autenticado");
        // User is signed out
        // ...
      }
    });
    // return valor;
}

updateProfile(name:string){
  var user = firebase.auth().currentUser;
  user.updateProfile({
    displayName: name
  }).then(function() {
    // Update successful.
  }).catch(function(error) {
    // An error happened.
  });
}

perfilUsuario(){
  return firebase.auth().currentUser;
}

refreshToken(){
  firebase.auth().currentUser.getIdToken(true)
  .then((idToken) => {
    localStorage.setItem('token',idToken);
  }).catch(function(error) {
  });
}
guardarUsuario(user:any){
  this.apiService.usuarioExistente(localStorage.getItem("uid")).subscribe(res => {
    if(res){
    }else{
      const uid = localStorage.getItem("uid");
      const correo = user.email;
      const nombre = user.displayName;
      this.apiService.guardarUsuario(uid,nombre,correo).subscribe(res=>res);
    }
  });
}
}
