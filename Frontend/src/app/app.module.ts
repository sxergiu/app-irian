import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

@NgModule({
  declarations: [/* your components */],
  imports: [/* your modules */],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // ✅ allow custom elements like <gmp-place-autocomplete>
})

export class AppModule{

}
