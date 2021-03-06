import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { CustomMaterialModule } from './modules/custom-material/custom-material.module';
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/content/content.component';
import { HttpClientModule } from '@angular/common/http';

import { YogiBotService } from './services/yogi-bot.service';
import { SayingService } from './services/saying.service';

import { CountryModule } from './modules/country/country.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Angulartics2Module } from 'angulartics2';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent
  ],
  imports: [
    BrowserModule,
    CustomMaterialModule,
    HttpClientModule,
    CountryModule,
    FormsModule,
    ReactiveFormsModule,
    Angulartics2Module.forRoot(),
    RouterModule.forRoot([])
  ],
  providers: [
    YogiBotService,
    SayingService,
    Location
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
