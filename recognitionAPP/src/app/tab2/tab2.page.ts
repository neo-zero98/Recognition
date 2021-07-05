import { Component } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { PersonaDetectada } from '../Models/personas-detectadas.model';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  private collection:any;
  private collecRef:any;
  personasDetectadas:PersonaDetectada[];
  btnLoader:boolean;

  constructor(
    private readonly afs: AngularFirestore,
    private apiService:ApiService,
    private router: Router,
    public actionSheetController: ActionSheetController
  ) {
    this.btnLoader = true;
    this.collection = localStorage.getItem('uid');
    this.collecRef = this.afs.doc<any>(`usuarios/${this.collection}`);
    this.collecRef.valueChanges().subscribe(val => this.obtenerPersonasDetectadas());
  }

  obtenerPersonasDetectadas(){
    this.apiService.obtenerPersonasDetectadas().subscribe(data => {
      this.personasDetectadas = data;
      this.btnLoader = false;
    });
  }

  goToPerfil(personaDetectada:PersonaDetectada){
    let navigationExtras = JSON.stringify(personaDetectada);
    this.router.navigate(['/tabs/tab2/personas-detectadas'],{ queryParams: {special:navigationExtras} });
  }

  deleteAllDetectPersons(){
    this.apiService.deleteAllDetectPersons().subscribe(data => {
      this.apiService.deleteAllDetectPhotos();
    },error => console.error(error));
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Eliminar',
        icon: 'trash',
        handler: () => {
          this.deleteAllDetectPersons();
        }
      },{
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
    await actionSheet.onDidDismiss();
  }



}
