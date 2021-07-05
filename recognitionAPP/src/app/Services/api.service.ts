import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Persona } from '../Models/persona.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { Photo } from '../Models/photo.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url:string;
  constructor(
    private http: HttpClient,
    private storage: AngularFireStorage
  ) {
    this.url = 'https://us-central1-recognition-47453.cloudfunctions.net/app'; //produccion
    // this.url = 'http://localhost:5000/recognition-47453/us-central1/app' //local
  }

  usuarioExistente(uid:string):Observable<any>{
    const headers = {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods':'POST,GET,PUT,DELETE,OPTIONS','Authorization': `Bearer ${localStorage.getItem('token')}`};
    return this.http.post(`${this.url}/api/usuario_existente`, {uid}, {headers})
            .pipe(
              map((data:any) => {
                return data.data;
              })
            )
  }
  guardarUsuario(uid:string,nombre:string,correo:string){
    const headers = {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods':'POST,GET,PUT,DELETE,OPTIONS','Authorization': `Bearer ${localStorage.getItem('token')}`};
    return this.http.post(`${this.url}/api/usuario`, {uid,nombre,correo}, {headers})
            .pipe(
              map((data:any) => data.message)
            )

  }
  consultarPersonas(){
    const headers = {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods':'POST,GET,PUT,DELETE,OPTIONS','Authorization': `Bearer ${localStorage.getItem('token')}`};
    const uid = localStorage.getItem("uid");
    return this.http.post(`${this.url}/api/personas`,{uid},{headers})
            .pipe(
              map((data:any)=>data.data)
            )
  }

  consultarPersonasById(idPersona:string){
    const headers = {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods':'POST,GET,PUT,DELETE,OPTIONS','Authorization': `Bearer ${localStorage.getItem('token')}`};
    const uid = localStorage.getItem("uid");
    return this.http.post(`${this.url}/api/persona/${idPersona}`,{uid},{headers})
            .pipe(
              map((data:any) => data.data)
            );
  }

  guardarPersona(person:Persona, actualizar?:string){
    const headers = {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods':'POST,GET,PUT,DELETE,OPTIONS','Authorization': `Bearer ${localStorage.getItem('token')}`};
    const uid = localStorage.getItem("uid");
    const objPerson = {
      celular: person.celular,
      correo: person.correo,
      edad: person.edad,
      foto: person.foto,
      id:person.id,
      nombre:person.nombre
    }
    let objPersona:any;
    objPersona = actualizar ? {
      uid:uid,
      actualizar:actualizar,
      persona:[objPerson]
    }:
    {
      uid:uid,
      persona:[objPerson]
    };
    return this.http.post(`${this.url}/api/persona`,objPersona,{headers})
    .pipe(
      map((data:any) => data.message)
    )
  }

  eliminarPersona(id_persona:string){
    const headers = {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods':'POST,GET,PUT,DELETE,OPTIONS','Authorization': `Bearer ${localStorage.getItem('token')}`};
    const uid = localStorage.getItem("uid");
    return this.http.post(`${this.url}/api/persona_eliminar`, {
      uid:uid,
      id_persona:id_persona
    },{headers})
    .pipe(
      map((data:any) => data.message)
    )

  }

  obtenerPersonasDetectadas(){
    const headers = {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods':'POST,GET,PUT,DELETE,OPTIONS','Authorization': `Bearer ${localStorage.getItem('token')}`};
    const uid = localStorage.getItem("uid");
    return this.http.post(`${this.url}/api/personas_detectadas`,{uid},{headers})
          .pipe(
            map((data:any)=>data.data)
          )
  }

  deleteAllDetectPersons(){
    const headers = {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods':'POST,GET,PUT,DELETE,OPTIONS','Authorization': `Bearer ${localStorage.getItem('token')}`};
    const uid = localStorage.getItem("uid");
    return this.http.post(`${this.url}/api/eliminar_personas_detectadas`,{uid},{headers})
          .pipe(
            map((data:any) => data.menssage)
          )
  }

  async uploadFile(base64:string, idImagen:string){
    const ref = this.storage.ref(`img/${idImagen}`);
    return await ref.putString(`data:image/jpg;base64,${base64}`, 'data_url');
  }

  readPhoto(idImagen:string){
    const ref = this.storage.ref(`img/${idImagen}`);
    return ref.getDownloadURL();
  }

  async deletePhoto(idImagen:string){
    const ref = this.storage.ref(`img/${idImagen}`);
    return await ref.delete();
  }

  deleteAllDetectPhotos(){
    const uid = localStorage.getItem('uid');
    return this.storage.ref(`detectPersons/${uid}`).listAll().subscribe(res => {
      res.items.forEach(file=>{
        file.delete();
      })
    }, error => console.error(error));
  }

}
