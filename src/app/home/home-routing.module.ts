import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'floor',
    loadChildren: () => import('./floor/floor.module').then( m => m.FloorPageModule)
  },
  {
    path: 'floor',
    loadChildren: () => import('./floor/floor.module').then( m => m.FloorPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
