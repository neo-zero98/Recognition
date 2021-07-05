import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastController: ToastController
  ) { }

  async succes(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: 'success',
      duration: 2000
    });
    toast.present();
  }
  async warning(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: 'warning',
      duration: 2000
    });
    toast.present();
  }
  async danger(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: 'danger',
      duration: 2000
    });
    toast.present();
  }

}
