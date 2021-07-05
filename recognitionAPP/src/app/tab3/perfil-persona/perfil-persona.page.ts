import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Platform } from '@ionic/angular';
import { Persona } from 'src/app/Models/persona.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/Services/toast.service';
import { ApiService } from 'src/app/Services/api.service';
import { PhotoService } from 'src/app/Services/photo.service';
import { Photo } from 'src/app/Models/photo.model';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Component({
  selector: 'app-perfil-persona',
  templateUrl: './perfil-persona.page.html',
  styleUrls: ['./perfil-persona.page.scss'],
})
export class PerfilPersonaPage implements OnInit {
  base64:string;
  photo:Photo;
  actualizar:string;
  btnLoader:boolean;
  btnFabButton:boolean;

  persona:Persona;
  formulario = this.fb.group({
    celular: [null,[
      Validators.required,
      Validators.minLength(10)
    ]],
    correo: [''],
    edad:[],
    foto:['',[
      Validators.required
    ]],
    id:[''],
    nombre:['',[
      Validators.required,
      Validators.minLength(3)
    ]]
  });

  constructor(
    private route:ActivatedRoute,
    private location: Location,
    private platform: Platform,
    private fb: FormBuilder,
    private toast:ToastService,
    private apiService:ApiService,
    public photoService: PhotoService,
    private photoViewer: PhotoViewer
  ) {
    this.btnFabButton = false;
    this.btnLoader = false;
    this.actualizar = '';
    this.persona = new Persona();
    this.photo = new Photo();
    this.route.queryParams.subscribe(params => {
      if(params && params.special){
        const persona = JSON.parse(params.special);
        this.persona = persona;
        this.btnFabButton = true;
        this.setFormulario();
      }
    });
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
   }

  ngOnInit() {

  }

  goBack() {
    this.location.back();
  }

  setFormulario(){
    this.formulario.get('celular').setValue(this.persona.celular);
    this.formulario.get('correo').setValue(this.persona.correo);
    this.formulario.get('edad').setValue(this.persona.edad);
    this.formulario.get('foto').setValue(this.persona.foto);
    this.formulario.get('id').setValue(this.persona.id);
    this.formulario.get('nombre').setValue(this.persona.nombre);
    this.setPhoto(this.persona.foto);
  }
  setPersona(){
    this.persona.celular = this.formulario.get('celular').value;
    this.persona.correo = this.formulario.get('correo').value;
    this.persona.edad = this.formulario.get('edad').value;
    this.persona.foto = this.formulario.get('foto').value;
    if(this.formulario.get('id').value !== ''){
      this.persona.id = this.formulario.get('id').value;
      this.actualizar = this.persona.id;
    }else{
      this.persona.id = new Date().getTime()+'';
    }
    this.persona.nombre = this.formulario.get('nombre').value;
  }

  setPhoto(idImagen:string){
    this.apiService.readPhoto(idImagen).subscribe( url => {
      this.photo.webviewPath = url;
    });
  }

  enviarFormulario(){
    if(this.formulario.invalid){
      this.toast.danger("no se guardo la persona");
      return;
    }
    this.setPersona();
    this.guardarPersona();
  }

  guardarPersona(){
    if(this.formulario.get('id').value !== ''){
      //actualizar
      this.apiService.guardarPersona(this.persona,this.actualizar).subscribe( data => {
        this.goBack();
        this.toast.succes("se guardo la persona");
      },error => {
        console.log(error);
        this.toast.danger("no se guardo la persona");
      });
    }else{
      //guardar
      this.apiService.guardarPersona(this.persona).subscribe( data => {
        this.goBack();
        this.toast.succes("se guardo la persona");
      },error => {
        console.log(error);
        this.toast.danger("no se guardo la persona");
      });
    }
  }

  addPhotoToGallery() {
    const fecha = new Date().getTime();
    const idImagen = `img-${fecha}.jpg`;
    this.photoService.addNewToGallery().then( data => {
      this.btnLoader = true;
      this.base64 = data;
      if(this.formulario.get('foto').value !== ''){
        this.apiService.deletePhoto(this.formulario.get('foto').value).then(data => console.log(data));
        this.formulario.get('foto').setValue('');
      }
      this.apiService.uploadFile(this.base64,idImagen).then(task=> {
        this.formulario.get('foto').setValue(idImagen);
        this.btnLoader = false;
      })
      this.photoService.savePicture(this.base64).then( img=> {
        this.photo = img;
      })
    })
  }

  goToWhatsapp(){
    window.open(`https://api.whatsapp.com/send?phone=+52${this.formulario.get('celular').value}`,"WhatsApp","width=220,height=300,scrollbars=NO");
  }

  goToCall(){
    window.open(`tel:+52${this.formulario.get('celular').value}`,"WhatsApp","width=220,height=300,scrollbars=NO");
  }

  viewPhoto(){
    if(this.photo.webviewPath){
    this.photoViewer.show(this.photo.webviewPath,this.formulario.get('nombre').value);
    }
  }

}
