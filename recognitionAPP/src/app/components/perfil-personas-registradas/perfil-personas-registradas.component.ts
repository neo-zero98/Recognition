import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Persona } from 'src/app/Models/persona.model';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-perfil-personas-registradas',
  templateUrl: './perfil-personas-registradas.component.html',
  styleUrls: ['./perfil-personas-registradas.component.scss'],
})
export class PerfilPersonasRegistradasComponent implements OnInit {

  @Input() lstPersonas:Persona[];
  @Output() sendPerson = new EventEmitter<Persona>();
  lstImg:any[];
  constructor(
    private apiService:ApiService
  ) {
    this.lstImg = [];
  }

  ngOnInit() {
    this.obtenerFotos();
  }

  enviarPersona(persona:Persona){
    this.sendPerson.emit(persona);
  }

  ionViewWillEnter(){
    this.obtenerFotos();
  }

  obtenerFotos(){
    this.lstImg = [];
    this.lstPersonas.forEach(foto => {
      this.lstImg.push(this.apiService.readPhoto(foto.foto));
    })
  }

  eliminarPersona(persona:Persona){
    this.apiService.eliminarPersona(persona.id).subscribe(res => {
      console.log(res);
      this.apiService.deletePhoto(persona.foto).then(data => data);
    },error => console.error(error))
  }


}
