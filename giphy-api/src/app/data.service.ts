import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';

export interface gifsData {
  data:[];
  total: number;
  offset: number;
  pageSize: number;
}
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private isSearched: boolean = false;
  private searchTerm: string = '';
  private offset: number = 0;
  private baseUrl: string = 'https://api.giphy.com/v1/gifs/';
  gifs = new BehaviorSubject<gifsData>({data: [], total:0, offset:0, pageSize:0});

  constructor(private httpClient: HttpClient) { }

  getInitialData() {
    return this.httpClient.get(`${this.baseUrl}trending?offset=${this.offset}&api_key=${environment.giphyApiKey}&limit=${environment.gifsPageSize}`)
    .subscribe((response : any) => {
      this.gifs.next({ 
        data: response.data, 
        total: response.pagination.total_count, 
        offset: response.pagination.offset,
        pageSize: environment.gifsPageSize });
    });
  }

  searchGif(term: string) {
    this.searchTerm = term;
    this.isSearched = true;
    return this.httpClient.get(`${this.baseUrl}search?q=${term}&offset=${this.offset}&api_key=${environment.giphyApiKey}&limit=${environment.gifsPageSize}`)
    .subscribe((response : any) => {
      this.gifs.next({ 
        data: response.data, 
        total: response.pagination.total_count, 
        offset: response.pagination.offset,
        pageSize: environment.gifsPageSize  });
    });
  }

  getData(offset: number){
    this.offset = offset;
    if(this.isSearched) { //may be user shouldn't pagination through trending gifs
      return this.searchGif(this.searchTerm);
    }
    return this.getInitialData()
  }

  getGifs() {
    return this.gifs.asObservable();
  }
}
