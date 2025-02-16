import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FloorPage } from './floor.page';

const routes: Routes = [
  {
    path: '',
    component: FloorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FloorPageRoutingModule {}
