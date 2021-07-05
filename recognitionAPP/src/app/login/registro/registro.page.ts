import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthenticationService } from 'src/app/Services/authentication.service';
import { ToastService } from 'src/app/Services/toast.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  form = this.fb.group({
    name: ['',[
      Validators.required,
      Validators.minLength(3)
    ]],
    email: ['',[
      Validators.required,
      Validators.minLength(6),
      Validators.pattern('^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$')
    ]],
    pass1:['',[
      Validators.required,
      Validators.minLength(8)
    ]],
    pass2:['',[
      Validators.required
    ]]
  },{validators: this.verificarPassword});
  constructor(
    private auth: AuthenticationService,
    private fb: FormBuilder,
    public toast: ToastService,
    private platform: Platform,
    private router:Router
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/']);
    });
  }

  ngOnInit() {
  }

  registrarse(){

  }

  verificarPassword(group:FormGroup){
    const pass1 = group.get('pass1').value;
    const pass2 = group.get('pass2').value;
    return pass1 === pass2 ? null: { notSame: true };
  }

  submit(){
    if(this.form.invalid){
      this.toast.danger("Datos incorrectos");
      return;
    }
    this.toast.succes("Se registro correctamente");
    this.auth.registro(this.form.get('name').value,this.form.get('email').value, this.form.get('pass1').value);
    this.form.reset();
  }

}
