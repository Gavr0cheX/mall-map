import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FloorPageRoutingModule } from './floor-routing.module';

import { FloorPage } from './floor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FloorPageRoutingModule
  ],
  declarations: [FloorPage]
})
export class FloorPageModule {}
