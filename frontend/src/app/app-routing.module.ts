import { createComponent, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/auth.guard';
import { ListComponent } from './gadgets/list/list.component';
import { RegisterComponent } from './auth/register/register.component';
import { UpdateComponent } from './gadgets/update/update.component';
import { CreateComponent } from './gadgets/create/create.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // ✅ Default to login
  { path: 'gadgets/list', component: ListComponent, canActivate: [authGuard] },
  { path: 'gadgets/add', component: CreateComponent, canActivate: [authGuard] },
  { path: 'gadgets/update/:id', component: UpdateComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '/login' } // ✅ Redirect unknown paths
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
