import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      (response: any) => {
        // Save the token or user data here
        localStorage.setItem('token', response.token); // Save JWT token (or any other method)
        this.router.navigate(['/home']);
      },
      (error:Error) => {
        console.error('Login failed', error);
      }
    );
  }
}
