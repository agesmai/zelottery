import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Header} from '../../../shared/layout/header/header';
import {ContainerComponent} from '@coreui/angular';

@Component({
  selector: 'app-user-layout',
  imports: [
    RouterOutlet,
    Header,
    ContainerComponent
  ],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.scss'
})
export class UserLayout {

}
