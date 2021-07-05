import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import * as faceapi from 'face-api.js';
import { ApiService } from 'src/app/services/api.service';
import { Persona } from 'src/app/models/persona.model';
import { PersonaDetectada } from 'src/app/models/personas-detectadas.model';

@Component({
  selector: 'app-recognition',
  templateUrl: './recognition.component.html',
  styleUrls: ['./recognition.component.css']
})
export class RecognitionComponent implements OnInit {
  overCanvas:any;
  btnCrearCanva:boolean;
  personas:Persona[];
  labelPersonas:any[];
  btnDetection:boolean;
  usuarioCanvas:any;
  lstFaceIds:string[];
  userFaceId:string;
  personaDetectada:PersonaDetectada;
  urlPhoto:string;

  constructor(
    private auth: AuthenticationService,
    private render:Renderer2,
    private elementRef: ElementRef,
    private apiService:ApiService,
  ) {
    this.btnCrearCanva = true;
    this.personas = [];
    this.obtenerPersonas();
    this.labelPersonas = [];
    this.btnDetection = true;
    this.lstFaceIds = [];
    this.personaDetectada = new PersonaDetectada();
   }

  @ViewChild("video")
    private video: ElementRef;

  ngOnInit(): void {
    this.cargarModelos();
  }

  logOut(){
    this.auth.logOut();
  }

  cargarModelos(){
    let models = [
      faceapi.loadSsdMobilenetv1Model('../../../assets/models'),
      faceapi.loadTinyFaceDetectorModel('../../../assets/models'),
      faceapi.loadMtcnnModel('../../../assets/models'),
      faceapi.loadFaceLandmarkModel('../../../assets/models'),
      faceapi.loadFaceLandmarkTinyModel('../../../assets/models'),
      faceapi.loadFaceRecognitionModel('../../../assets/models'),
      faceapi.loadFaceExpressionModel('../../../assets/models')
    ]
    Promise.all(models).then(res => {
      console.log("modelos cargados");
      this.startVideo();
    });
  }
  public startVideo() {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio:false }).then(async (stream) => {
          this.video.nativeElement.srcObject=stream;
          this.video.nativeElement.play();
          setInterval(async ()=>{
            this.onPlay();
          },100);
        });
    }
  }

  async onPlay(){
    const inputSize = 512;
    const scoreThreshold = 0.5;
    const detections = await faceapi.detectAllFaces(this.video.nativeElement,
      new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold }))
      .withFaceLandmarks()
      .withFaceDescriptors();
    const detectionsForSize = faceapi.resizeResults(detections, { width: 640, height: 480 });

    if(detections[0] && this.btnDetection && this.personas.length > 0){
      this.usuarioCanvas = faceapi.createCanvasFromMedia(this.video.nativeElement);
      setTimeout(()=>{
        this.subirImagenCache(this.usuarioCanvas.toDataURL());
      },12000);
      this.btnDetection = false;
    }

    if(this.btnCrearCanva){
      this.overCanvas = faceapi.createCanvasFromMedia(this.video.nativeElement);
      this.render.setProperty(this.overCanvas, 'id','newCanvas');
      this.render.setStyle(this.overCanvas, 'width', `${640}px`);
      this.render.setStyle(this.overCanvas, 'height', `${480}px`);
      this.render.setStyle(this.overCanvas, 'top', `${105}px`);
      this.render.setStyle(this.overCanvas, 'left', `${117}px`);
      this.render.setStyle(this.overCanvas, 'position', `absolute`);
      this.render.appendChild(this.elementRef.nativeElement, this.overCanvas);
      this.btnCrearCanva = false;
    }
    this.overCanvas.getContext("2d").clearRect(0,0,640,480);
    faceapi.draw.drawDetections(this.overCanvas,detectionsForSize);
  }

  obtenerPersonas(){
    this.apiService.consultarPersonas().subscribe(data => {
      this.personas = data;
      this.personas.forEach( persona => {
        this.getUrlPhoto(persona);
      });
      console.log(this.personas);
      console.log(this.labelPersonas);
    });
  }

  getUrlPhoto(persona:Persona){
    this.apiService.readPhoto(persona.foto).subscribe( url => {
      this.setLabelPersonas(url,persona);
    });
  }

  setLabelPersonas(url:string,persona:Persona){
    this.apiService.getFaceDetection(url).subscribe( (face:any) => {
      this.labelPersonas.push({
        idPersona: persona.id,
        nombre: persona.nombre,
        urlPhoto: url,
        faceId:face
      });
      this.obtenerLstFaceIds();
      console.log(this.lstFaceIds);
    })
  }

  obtenerLstFaceIds(){
    this.lstFaceIds = this.labelPersonas.map((facePersona:any) => facePersona.faceId);
  }

  subirImagenCache(base64:string){
    const fecha = new Date().getTime();
    let nameImg = `detec-${fecha}.png`;
    this.apiService.uploadFile(base64,nameImg).then( task => {
      this.apiService.readPhotoFacePerson(nameImg).subscribe(url => {
        this.urlPhoto = url;
        this.obtenerUserFaceId();
      })
    });
  }

  obtenerUserFaceId(){
    this.apiService.getFaceDetection(this.urlPhoto).subscribe( faceId =>{
      this.userFaceId = faceId;
      this.faceRecognition();
      console.log("faceId webCam: ",this.userFaceId);
    })
  }

  faceRecognition(){
    this.apiService.getFindFaceSimilar(this.userFaceId,this.lstFaceIds).subscribe((reconocimiento:any) => {
      if(reconocimiento){
        console.log("Conocido");
        console.log(reconocimiento);
        this.obtenerPersonaDetectada(reconocimiento);
      }else{
        console.log("Desconocido");
        this.obtenerPersonaDetectada();
      }
      this.btnDetection = true;
    })
  }

  obtenerPersonaDetectada(reconocimiento?:any){
    this.personaDetectada = new PersonaDetectada();
    this.personaDetectada.url = this.urlPhoto;
    let labelPerson:any;
    if(reconocimiento){
      labelPerson = this.labelPersonas.map( label =>{
        if(label.faceId === reconocimiento.faceId){
          this.personaDetectada.idPersona = label.idPersona;
          this.personaDetectada.nombre = label.nombre;
          return label;
        }
      });
    }else{
      this.personaDetectada.idPersona = null;
      this.personaDetectada.nombre = "Desconocido";
    }
    this.guardarPersonaDetectada();
    console.log(this.personaDetectada);
  }

  guardarPersonaDetectada(){
    this.apiService.guardarPersonaDetectada(this.personaDetectada).subscribe(data => console.log(data));
  }

}
