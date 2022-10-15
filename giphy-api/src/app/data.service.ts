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
  gifs = new BehaviorSubject<gifsData>({data: [], total:0, offset:0, pageSize:0});

  constructor(private httpClient: HttpClient) { }

  getInitialData() {
    return this.httpClient.get(`https://api.giphy.com/v1/gifs/trending?api_key=${environment.giphyApiKey}&limit=${environment.gifsPageSize}`)
    .subscribe((response : any) => {
      this.gifs.next({ 
        data: response.data, 
        total: response.pagination.total_count, 
        offset: response.pagination.offset,
        pageSize: environment.gifsPageSize });
    });
  }

  searchGif(term: string) {
    return this.httpClient.get(`https://api.giphy.com/v1/gifs/search?q=${term}&api_key=${environment.giphyApiKey}&limit=${environment.gifsPageSize}`)
    .subscribe((response : any) => {
      this.gifs.next({ 
        data: response.data, 
        total: response.pagination.total_count, 
        offset: response.pagination.offset,
        pageSize: environment.gifsPageSize  });
    });
  }

  getGifs() {
    return this.gifs.asObservable();
  }
}
