import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email:FormControl;
  password:FormControl;
  constructor(
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.email = new FormControl('');
    this.password = new FormControl('');
   }

  ngOnInit() {
  }

  logIn(){
    this.auth.logIn(this.email.value, this.password.value);
    this.email.reset();
    this.password.reset();
  }
  loginGoogle(){
    this.auth.logInWithGoogle();
  }

}
