import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BiometriaRoutingModule } from './biometria-routing.module';
import { ValidatorFacialComponent } from './components/validator-facial/validator-facial.component';
import { HttpClientModule } from '@angular/common/http';
import { BiometriaDomainService } from './services/biometria-domain.service';
@NgModule({
  declarations: [
    ValidatorFacialComponent
  ],
  imports: [
    CommonModule,
    BiometriaRoutingModule,
     HttpClientModule, // 👈 Obligatorio para que funcione el servicio HTTP
    // BiometriaRoutingModule
  ],
   providers: [
    BiometriaDomainService // 👈 El servicio queda aislado dentro de este módulo funcional
  ]
})
export class BiometriaModule { }
