import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email:FormControl;
  password:FormControl;
  constructor(
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.email = new FormControl('');
    this.password = new FormControl('');
   }

  ngOnInit(): void {
  }

  logIn(){
    if(this.email.invalid || this.password.invalid){
      return;
    }
    this.auth.logIn(this.email.value, this.password.value);
    this.email.reset();
    this.password.reset();
  }

  loginGoogle(){
    this.auth.logInWithGoogle();
  }
}
