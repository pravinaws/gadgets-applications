import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  step = 1;
  mobile = '';
  otp = '';
  isLoading = false;
  error = '';
  channel = false;
  public countryCode: any = '+91';
  public resendCountdown : number = 60;
  resendTimer: any;
  public notifyMsg: any;

  constructor(private authService: AuthService, private router: Router) {
    const token = localStorage.getItem('token');
    
    if (token) {
      this.router.navigate(['/gadgets/list']);
    }
  }

  ngOnInit(): void {
    this.authService.getCountryCode().subscribe((code: string) => {
      this.countryCode = code;
      console.log('Detected country code:', this.countryCode);
    });
  }

  startResendTimer() {
    this.resendCountdown = 60;
    console.log('cdd',this.resendCountdown)
    this.resendTimer = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        clearInterval(this.resendTimer);
      }
    }, 1000);
  }

  resendOtp(event: Event) {
    event.preventDefault();
    this.sendOtp(); // resend the OTP
  }

  sendOtp() {
    this.isLoading = true;
    this.error = '';    
    let fullPhoneNumber = `${this.countryCode}${this.mobile}`;
    this.authService.sendOtp(fullPhoneNumber, this.channel?'sms':'whatsapp').subscribe({
      next: (res) => {
        console.log('OTP sent:', res);
        this.notifyMsgFunction(res.message);
        this.step = 2;
        this.startResendTimer();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to send OTP. Try again.';
        this.isLoading = false;
        this.notifyMsgFunction(err.message);
        console.error("---------"+err);
      }
    });
  }

  notifyMsgFunction(msg : string){
    this.notifyMsg = msg;
    setTimeout(() => {
      this.notifyMsg = null;
    }, 10000);
  }

  verifyOtp() {
    this.isLoading = true;
    this.error = '';
    let fullPhoneNumber = `${this.countryCode}${this.mobile}`;
    let name = "Pravin Bambale"
    this.authService.verifyOtp(fullPhoneNumber, Number(this.otp), name).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/gadgets/list']);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'OTP verification failed.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  ngAfterViewInit() {
    const stars = document.querySelectorAll('.star');
    document.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const offsetX = (clientX - centerX) / centerX;
      const offsetY = (clientY - centerY) / centerY;

      stars.forEach((star, index) => {
        const intensity = (index + 1) * 0.5;
        const moveX = offsetX * intensity * 10;
        const moveY = offsetY * intensity * 10;
        (star as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.resendTimer);
  }
}
