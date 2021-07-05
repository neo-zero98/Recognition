import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonaDetectada } from '../models/personas-detectadas.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url:string;
  private urlFaceDetection:string;
  private urlFindSimilars:string;
  constructor(
    private http: HttpClient,
    private storage: AngularFireStorage
  ) {
    this.urlFaceDetection = 'https://southcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&recognitionModel=recognition_04&returnRecognitionModel=false&detectionModel=detection_03&faceIdTimeToLive=86400';
    this.urlFindSimilars = 'https://southcentralus.api.cognitive.microsoft.com/face/v1.0/findsimilars';
    this.url = 'https://us-central1-recognition-47453.cloudfunctions.net/app'; //produccion
    // this.url = 'http://localhost:5000/recognition-47453/us-central1/app' //local
  }

  consultarPersonas(){
    const headers = {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods':'POST,GET,PUT,DELETE,OPTIONS','Authorization': `Bearer ${localStorage.getItem('token')}`};
    const uid = localStorage.getItem("uid");
    return this.http.post(`${this.url}/api/personas`,{uid},{headers})
            .pipe(
              map((data:any)=>data.data)
            )
  }

  guardarPersonaDetectada(personaDetectada:PersonaDetectada){
    const headers = {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods':'POST,GET,PUT,DELETE,OPTIONS','Authorization': `Bearer ${localStorage.getItem('token')}`};
    const uid = localStorage.getItem("uid");
    const body = {
      uid,
      persona:[{
        idPersona: personaDetectada.idPersona,
        nombre    : personaDetectada.nombre,
        visto     : personaDetectada.visto,
        fecha     : personaDetectada.fecha,
        url       : personaDetectada.url
      }]
    }
    return this.http.post(`${this.url}/api/persona_detectada`,body,{headers});

  }

  readPhoto(idImagen:string){
    const ref = this.storage.ref(`img/${idImagen}`);
    return ref.getDownloadURL();
  }

  getFaceDetection(url:string){
    return this.http.post(this.urlFaceDetection,{url},{headers:{
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key':'384c41e5cbbd482f9d57bbe84a2a34b9'
    }})
    .pipe(
      map( (face:any) => {
        return face[0].faceId;
      })
    );
  }

  getFindFaceSimilar(faceId:string,faces:string[]){
    return this.http.post(this.urlFindSimilars,{
      "faceId": faceId,
      "faceIds": faces,
      "maxNumOfCandidatesReturned": 1,
      "mode": "matchPerson"
    },{headers:{
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key':'384c41e5cbbd482f9d57bbe84a2a34b9'
    }})
    .pipe(
      map(data => data[0])
    );
  }

  async uploadFile(base64:string, idImagen:string){
    const uid = localStorage.getItem('uid');
    const ref = this.storage.ref(`detectPersons/${uid}/${idImagen}`);
    return await ref.putString(base64, 'data_url');
  }

  readPhotoFacePerson(idImagen:string):Observable<any>{
    const uid = localStorage.getItem('uid');
    const ref = this.storage.ref(`detectPersons/${uid}/${idImagen}`);
    return ref.getDownloadURL();
  }
}
