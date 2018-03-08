import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private chartData: Array<any>;

  constructor() {}

  ngOnInit() {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    setTimeout(() => {
      this.generateData();

      // Change the data after each 3000 milliseconds
      setInterval(() => this.generateData(), 3000);
    }, 1000);
  }

  /* We are generating a random array of numbers every three seconds to demonstrate dynamic data updates. In a real-world scenario this data will be loaded from an API. */
  generateData() {
    this.chartData = [];
    for (let i = 0; i < (8  + Math.floor(Math.random() * 10)); i++) {
      this.chartData.push([
        `Index ${i}`,
        Math.floor(Math.random() * 100)
      ]);
    }
  }
}
