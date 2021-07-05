import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Persona } from '../Models/persona.model';
import { ApiService } from '../Services/api.service';
import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  btnOpcion:string;
  btnMenu:boolean;
  personas:Persona[];
  btnLoader:boolean;
  private collection:any;
  private collecRef:any;
  constructor(
    private readonly afs: AngularFirestore,
    private auth:AuthenticationService,
    private apiService:ApiService,
    private router:Router
  ) {
    this.btnLoader = true;
    this.btnMenu = false;
    this.personas = [];
    this.collection = localStorage.getItem('uid');
    this.collecRef = this.afs.doc<any>(`usuarios/${this.collection}`);
    this.collecRef.valueChanges().subscribe(val => this.obtenerPersonas());
  }

  logOut(){
    this.auth.logOut();
  }

  saludoComponente(event:any){
    this.btnMenu = false;
    this.btnOpcion = event;
    if(event === 'usuarios'){

    }else if(event === 'cerrar_sesion'){
      this.logOut();
    }
    console.log(this.btnOpcion);
  }

  obtenerPersonas(){
    this.btnLoader = true;
    this.apiService.consultarPersonas().subscribe(data => {
      this.personas = data;
      this.btnLoader = false;
    });
  }

  goToPerfil(persona?:Persona){
    if(persona){
      let navigationExtras = JSON.stringify(persona);
      this.router.navigate(['/tabs/tab3/perfil-persona'],{ queryParams: {special:navigationExtras} });
    }else{
      this.router.navigate(['/tabs/tab3/perfil-persona']);
    }
  }
}
