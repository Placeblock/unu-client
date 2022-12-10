import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gameid-input',
  templateUrl: './gameid-input.component.html',
  styleUrls: ['./gameid-input.component.scss']
})
export class GameidInputComponent implements OnDestroy {
  @Output("value") valueChangeEvent = new EventEmitter<string>();
  gameidForm = this.fb.nonNullable.group({
    firstDigit: new FormControl<string>("", [Validators.required]),
    secondDigit: new FormControl<string>("", [Validators.required]),
    thirdDigit: new FormControl<string>("", [Validators.required]),
    fourthDigit: new FormControl<string>("", [Validators.required])
  });
  formSubscription: Subscription;

  constructor(private fb: FormBuilder) {
    this.formSubscription = this.gameidForm.valueChanges.subscribe(value => {
      let stringvalue = "" + value.firstDigit + value.secondDigit + value.thirdDigit + value.fourthDigit;
      this.valueChangeEvent.emit(stringvalue);
    })
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  focusHandler(event: Event) {
    let target = event.target as HTMLInputElement;
    let nextSibling = target.nextElementSibling;
    if (target.value.length > 0 && nextSibling instanceof HTMLInputElement) {
      nextSibling.focus();
    }
  }

  keyHandler(event: KeyboardEvent): boolean {
    return event.code === "Backspace" || /^\d$/.test((event.target as HTMLInputElement).value + event.key);
  }
}
