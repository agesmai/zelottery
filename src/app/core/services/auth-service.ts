import {Injectable} from '@angular/core';
import {Auth, onAuthStateChanged, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import {doc, Firestore, setDoc} from '@angular/fire/firestore';
import {BehaviorSubject} from 'rxjs';
import {User} from '../models/user';


@Injectable({providedIn: 'root'})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const appUser: User = {
          uid: user.uid,
          email: user.email ?? '',
          displayName: user.displayName ?? '',
          photoURL: user.photoURL ?? '',
          emailVerified: user.emailVerified
        };

        this.currentUserSubject.next(appUser);
        await this.saveUserToFirestore(appUser);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    await signOut(this.auth);
  }

  private async saveUserToFirestore(user: User) {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userRef, user, {merge: true});
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
