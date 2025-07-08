import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {
  HeaderComponent,
  HeaderBrandComponent,
  HeaderNavComponent,
  HeaderTextComponent,
  ContainerComponent,
  ButtonModule
} from '@coreui/angular'


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
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

}
