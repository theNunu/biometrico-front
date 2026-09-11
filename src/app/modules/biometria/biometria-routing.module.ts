import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidatorFacialComponent } from './components/validator-facial/validator-facial.component';
// import { ValidadorFacialComponent } from './components/validador-facial/validador-facial.component';
const routes: Routes = [
   {
    path: '', // 👈 Cuando se acceda a este módulo, carga este componente directamente
    component: ValidatorFacialComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiometriaRoutingModule { }
