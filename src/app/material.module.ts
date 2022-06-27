import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  exports: [
    MatSelectModule, 
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,],
})
export class MaterialModule {}