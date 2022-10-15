import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, OnDestroy {

  totalCount: number = 0;
  offset: number = 0; 
  pageSize: number = 0;
  gifs: any[] = [];
  subscripton: Subscription = new Subscription;

  constructor(private dataService: DataService) { }

  ngOnDestroy(): void {
    this.subscripton.unsubscribe();
  }

  ngOnInit(): void {
    this.dataService.getInitialData();
    this.subscripton = this.dataService.getGifs()
      .subscribe((response: any) => {
        console.log('content', response)
        this.totalCount = response.total;
        this.offset = response.offset;
        this.gifs = response.data;
        this.pageSize = response.pageSize;
      })
  }

  changePage(e: any) {
    console.log(e);
  }

}
