import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilPersonaPageRoutingModule } from './perfil-persona-routing.module';

import { PerfilPersonaPage } from './perfil-persona.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilPersonaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PerfilPersonaPage]
})
export class PerfilPersonaPageModule {}
