import { Component, OnInit, OnDestroy } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import * as actions from '../../shared/ui.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

interface UserForms {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit, OnDestroy {
  userFormGroup!: FormGroup<UserForms>;

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

  createUser() {
    this.store.dispatch(actions.isLoading());

    const { name, email, password } = this.userFormGroup.value;

    this.authService
      .createUser(email!, name!, password!)
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

  private createForm() {
    this.userFormGroup = this.formBuilder.nonNullable.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
}
