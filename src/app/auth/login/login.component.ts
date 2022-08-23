import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

import * as actions from '../../shared/ui.actions';

import { Subscription } from 'rxjs';

interface LoginForms {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginFormGroup!: FormGroup<LoginForms>;

  isLoading = false;
  uiSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.uiSubscription = this.store
      .select('ui')
      .subscribe((ui) => (this.isLoading = ui.isLoading));
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  public loggin() {
    this.store.dispatch(actions.isLoading());

    const { email, password } = this.loginFormGroup.value;
    this.authService
      .loggin(email!, password!)
      .then(() => {
        this.store.dispatch(actions.stopLoading());
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
