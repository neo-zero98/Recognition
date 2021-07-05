import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Persona } from 'src/app/Models/persona.model';
import { PersonaDetectada } from 'src/app/Models/personas-detectadas.model';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-personas-detectadas',
  templateUrl: './personas-detectadas.page.html',
  styleUrls: ['./personas-detectadas.page.scss'],
})
export class PersonasDetectadasPage implements OnInit {

  personaDetectada:PersonaDetectada;
  private idPersona:string;
  persona:Persona;

  constructor(
    private route:ActivatedRoute,
    private apiService:ApiService,
    private router:Router,
    private photoViewer: PhotoViewer
  ) {
    this.route.queryParams.subscribe(params => {
      if(params && params.special){
        const persona = JSON.parse(params.special);
        this.personaDetectada = persona;
        if(this.personaDetectada.idPersona){
          this.idPersona = this.personaDetectada.idPersona;
          this.consultarPersona();
        }
      }
    });
   }

  ngOnInit() {
  }

  consultarPersona(){
    this.apiService.consultarPersonasById(this.idPersona).subscribe(res => {
      this.persona = res;
    })
  }

  goToPerfil(){
      let navigationExtras = JSON.stringify(this.persona);
      this.router.navigate(['/tabs/tab3/perfil-persona'],{ queryParams: {special:navigationExtras} });
  }

  viewPhoto(){
    this.photoViewer.show(this.personaDetectada.url,this.personaDetectada.nombre);
  }


}
