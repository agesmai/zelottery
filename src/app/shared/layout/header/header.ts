import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {
  ButtonModule,
  ContainerComponent,
  HeaderBrandComponent,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTextComponent
} from '@coreui/angular'
import {AuthService} from '../../../core/services/auth-service';
import {AsyncPipe} from '@angular/common';


@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    HeaderComponent,
    HeaderBrandComponent,
    HeaderNavComponent,
    HeaderTextComponent,
    ContainerComponent,
    ButtonModule,
    AsyncPipe,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  private authService = inject(AuthService);
  user$ = this.authService.currentUser$;

  logout() {
    this.authService.logout().then(() => console.log("User signed out."));
  }
}
