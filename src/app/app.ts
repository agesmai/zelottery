import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ThemeService} from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'zelottery';
  constructor(private theme: ThemeService) {
    theme.init();
  }

}
