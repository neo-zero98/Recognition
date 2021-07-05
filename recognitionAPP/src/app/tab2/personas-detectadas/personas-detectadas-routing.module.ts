import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonasDetectadasPage } from './personas-detectadas.page';

const routes: Routes = [
  {
    path: '',
    component: PersonasDetectadasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonasDetectadasPageRoutingModule {}
