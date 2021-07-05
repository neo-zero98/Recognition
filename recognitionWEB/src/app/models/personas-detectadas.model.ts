export class PersonaDetectada{
  idPersona : string;
  nombre    : string;
  visto     : boolean;
  fecha     : Date;
  url       : string;

  constructor(){
    this.visto = false;
    this.fecha = new Date();
  }
}