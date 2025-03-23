import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService,private router : Router) {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (!token) {
      // alert('Unauthorized. Please log in.');
      this.router.navigate(['/login']);
      return;
    }else{
      this.router.navigate(['/gadgets/list']);
    }
  }

  onInit(){
    
  }
  onLogin() {
    this.authService.login(this.email, this.password);
  }
}
