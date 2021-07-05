import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilPersonaPage } from './perfil-persona.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilPersonaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilPersonaPageRoutingModule {}
