import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as actions from '../auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubscription: Subscription;

  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe({
      next: (fuser) => {
        if (fuser) {
          this.userSubscription = this.firestore
            .doc(`${fuser.uid}/user`)
            .valueChanges()
            .subscribe((firestoreUser: any) => {
              const user = User.fromFirebase(firestoreUser);
              this.store.dispatch(actions.setUser({ user }));
            });
        } else {
          this.userSubscription.unsubscribe();
          this.store.dispatch(actions.unSetUser());
        }
      },
      error: (err) => console.log(err),
    });
  }

  loggin(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  loggout() {
    return this.auth.signOut();
  }

  createUser(email: string, name: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new User(user.uid, name, email);
        return this.firestore.doc(`${user.uid}/user`).set({ ...newUser });
      });
  }

  isAuth() {
    return this.auth.authState.pipe(map((fbUser) => fbUser != null));
  }
}
