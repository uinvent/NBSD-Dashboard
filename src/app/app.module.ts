import {} from '@types/googlemaps';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import {MatButtonModule, MatToolbarModule, MatMenuModule, MatIconModule, MatCardModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { HttpModule } from '@angular/http';
import { Ng2CompleterModule } from 'ng2-completer';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

import { StationService } from './services';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, MatButtonModule, MatToolbarModule, MatMenuModule, MatIconModule, MatCardModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyB1v75z07MGLy0AHPASIi7TV3y7LErF67w', libraries: ['geometry'] }),
    HttpModule, Ng2CompleterModule, FormsModule, ChartsModule
  ],
  exports: [MatButtonModule, MatToolbarModule, MatMenuModule, MatIconModule, MatCardModule],
  providers: [StationService],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
