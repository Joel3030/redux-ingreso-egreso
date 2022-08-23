import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';

interface LoginForms {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup<LoginForms>;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  public loggin() {
    Swal.fire({
      title: 'Loading!',
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const { email, password } = this.loginFormGroup.value;
    this.authService
      .loggin(email!, password!)
      .then(() => {
        Swal.close();
        this.router.navigate(['/']);
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        });
      });
  }

  private createForm(): void {
    this.loginFormGroup = this.formBuilder.nonNullable.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
}
