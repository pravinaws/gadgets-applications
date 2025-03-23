import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  loginStatus : boolean = true;
  constructor(public authService: AuthService){
    
  }

  ngOnInit(){
    // this.loginStatus = ;
    console.log('loginStatus ',this.loginStatus)
  }
}
