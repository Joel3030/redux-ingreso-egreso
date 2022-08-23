import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe({
      next: (fuser) => {},
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
