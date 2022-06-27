import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { TestingLibraryComponent } from './testinglibrary/testinglibrary.component';


export const examples = [
  {
    path: 'auto-complete',
    component: AutoCompleteComponent,
    data: {
      name: 'Auto Complete Example',
    },
  },
  {
    path: 'testingLibrary',
    component: TestingLibraryComponent,
    data: {
      name: 'Testing Library Example',
    },
  }
];
export const routes: Routes = [
  { path: '', component: AutoCompleteComponent},
  { path: 'auto-complete',component: AutoCompleteComponent },
  { path: 'testinglibrary', component: TestingLibraryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
