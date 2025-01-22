import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() label: string = ''; // Label for the date picker
  @Input() maxDate: Date | null = null; // Maximum selectable date

  value: string = ''; // Bound value
  isDisabled: boolean = false; // To handle disabled state

  // Propagating change and touch events to parent form
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  // Handle input change
  onInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value; // Explicit type casting
    this.value = inputValue;
    this.onChange(inputValue);
    this.onTouched();
  }

  // Implement ControlValueAccessor methods
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
