import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FooterComponent} from './footer/footer.component';
import {BindingComponent} from './binding/binding.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BindingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Frontend';
}
