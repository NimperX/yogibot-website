import { Injectable, Inject } from '@angular/core';
import { COUNTRIES_DATA, Countries, LANGUAGES_DATA, Languages } from '../modules/country/models';

import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';

import { Saying } from '../models/saying';
import { YogiBotService } from './yogi-bot.service';
import { HttpClient } from '@angular/common/http';
import { IpInfo } from '../models/ipInfo';

export interface Language {
  name: string;
}

// Service for handling page content
@Injectable()
export class SayingService {

  // Map for support languages.
  supportLanguages = {
    'English': 'en',
    'German': 'de'
  };

  // default language is English
  previousLanguage = '';
  currentLanguage: Language = { name: 'English' };
  currentSaying: Saying = {
    number: '',
    language: '',
    saying: '',
    comment: ''
  };
  count = 0;

  constructor(
    private httpClient: HttpClient,
    private yogibot: YogiBotService,
    @Inject(COUNTRIES_DATA) private countriesData: Countries,
    @Inject(LANGUAGES_DATA) private languagesData: Languages
  ) {
    this.setCurrentLanguageIndex();
    console.log('constructor', this.currentSaying);
  }

  getSupportLanguages(): string[] {
    return _.keys(this.supportLanguages);
  }

  // use ipinfo to get client's country code and get language
  setCurrentLanguageIndex(): void {
    this.httpClient
      .get<IpInfo>('https://ipinfo.io/json')
      .subscribe(ipInfo => {
        console.log(ipInfo);
        const countryCode = ipInfo.country;
        const currentLangs = _.values(this.countriesData[countryCode].languages);
        // check if this language is supported
        const lang = _.findKey(this.supportLanguages, _.partial(_.isEqual, currentLangs));
        if (lang) {
          this.currentLanguage.name = lang;
          this.previousLanguage = lang;
        }
        // generate first saying
        this.generateNewSaying();
      });
  }

  // call when language selection change
  onSelectionChange() {
    // language should be available then generate new saying
    if (this.supportLanguages[this.currentLanguage.name] && this.currentLanguage.name !== this.previousLanguage) {
      this.generateNewSaying();
      this.previousLanguage = this.currentLanguage.name;
    }
  }

  // call when click generate button
  generateNewSaying() {
    this.yogibot.getSaying(this.supportLanguages[this.currentLanguage.name])
      .subscribe((saying: Saying[]) => {
        Object.assign(this.currentSaying, saying[0]);
        console.log(this.currentSaying, saying);
      },
      (err: any) => {
        this.currentSaying.saying = 'API not reachable';
        return Promise.reject(err.message || err);
      });
  }
}
