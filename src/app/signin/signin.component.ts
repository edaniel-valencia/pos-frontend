import { Component, inject, Inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  Uemail: string = '';
  Upassword: string = '';
  loading: boolean = false;

  constructor(
    private toastr: ToastrService,
    private _userService:  UserService,
    private router: Router,
    private _errorService: ErrorService
  ){}

  ngOnInit(): void {}
  login(){
    if (this.Uemail == '' || this.Upassword == '') {
      this.toastr.error('Todos los campos son obligatorios!', 'Error');
      return
    }

    //CREAMOS EL OBJETO
    const user: User = {
      Uemail: this.Uemail,
      Upassword: this.Upassword
    }
    this.loading =  true

    this._userService.login(user).subscribe({
      next: (response: any) => {
        this.loading =  false
        const token = response.token
      //  console.log(token);     
        this.toastr.success("", "Bienvenido")
        this.router.navigate(['/dashboard']) 
        localStorage.setItem('myToken',token) 
      },
      error: (e: HttpErrorResponse) => {
        this.loading =  false
        this._errorService.msgError(e)
      },
    })   
  }

}
