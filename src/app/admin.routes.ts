import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { PublicComponent } from './public/public.component';
import { NgModule } from '@angular/core';

export const admin_routes: Routes = [
     
    {
        path: '', component: AdminComponent,
        // children: [
        //   {
        //     path: '',
        //     loadChildren: () => import('./admin/admin.component').then(m => m.AdminComponent),
        //   }
        // ]
      },
      // {
      //   path: '',
      //   component: PublicComponent,
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () => import('./public/public.component').then(m => m.PublicComponent),
      //     }
      //   ]
      // }
];


@NgModule({
    imports: [RouterModule.forRoot(admin_routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }