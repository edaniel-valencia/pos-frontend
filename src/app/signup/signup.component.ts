import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-signup',
    imports: [RouterLink],
    templateUrl: './signup.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './signup.component.css'
})
export class SignupComponent {

}
