import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
export class Feedback{
  public name: string = "";
  public rating: number = 10;
  public description: string = "";
  public shirtSize: string = "M";
}
@Component({
  selector: 'app-testing-library-example',
  templateUrl: './testing-library-example.component.html',
  styleUrls: ['./testing-library-example.component.css']
})
// following https://timdeschryver.dev/blog/good-testing-practices-with-angular-testing-library#getting-started
export class TestingLibraryExampleComponent {
  shirtSizes = [{id: 1, value: 'S'}, {id: 2, value: 'M'}, {id: 3, value: 'L'}];
  @Output() submitForm = new EventEmitter<Feedback>();

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    rating: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
    description: [''],
    shirtSize: ['', [Validators.required]]
  });

  nameControl = this.form.get('name');
  ratingControl = this.form.get('rating');
  shirtSizeControl = this.form.get('shirtSize');

  constructor(private formBuilder: FormBuilder) {}

  submit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value as any);
    }
  }
}
