import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'biometria', // 👈 La URL en tu navegador será http://localhost:4200/biometria
    loadChildren: () => import('./modules/biometria/biometria.module').then(m => m.BiometriaModule)
  },
  {
    path: '', // Redirecciona la raíz automáticamente a la sección de biometría
    redirectTo: 'biometria',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
