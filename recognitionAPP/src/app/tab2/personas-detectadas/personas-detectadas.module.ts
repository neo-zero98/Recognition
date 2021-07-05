import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersonasDetectadasPageRoutingModule } from './personas-detectadas-routing.module';

import { PersonasDetectadasPage } from './personas-detectadas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonasDetectadasPageRoutingModule
  ],
  declarations: [PersonasDetectadasPage]
})
export class PersonasDetectadasPageModule {}
