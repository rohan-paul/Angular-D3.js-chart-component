import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from "@angular/core";
import * as d3 from 'd3';

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.css'],
    encapsulation: ViewEncapsulation.None

})

export class BarChartComponent implements OnInit, OnChanges {

    @ViewChild('chart') private chartContainer: ElementRef;

    /* https://www.concretepage.com/angular-2/angular-2-viewchild-example
  If we have a template reference variable defined in parent component as below. (A template reference variable is simply a named reference to a DOM element within a template. You can view it as something similar to id attribute of an html element. You mark a DOM element with a template reference and then query it inside a class using ViewChild decorator. ElementRef can be returned for any DOM element using ViewChild decorator. - https://blog.angularindepth.com/exploring-angular-dom-abstractions-80b3ebcfc02)

<input type="text" #title>

Then we can use that "title" template variable with @ViewChild() as given below.

@ViewChild('title')
private elTitle : ElementRef;

In this app, I have the #chart reference variable (which is a native DOM element) defined in bar-chart.component.ts  And the chartContainer is declared as a @ViewChild of type ElementRef, which allows the component to directly access the native element (which D3 needs), by receiving the ElementRef associated with this element.*/

   @Input() private data: Array<any>;

   private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
   private chart: any;
   private width: number;
   private height: number;
   private xScale: any;
   private yScale: any;
   private colors: any;
   private xAxis: any;
   private yAxis: any;

   constructor() {}

   ngOnInit() {
       this.createChart();
       if (this.data) {
           this.updateChart();
       }
   }

   ngOnChanges() {
       if (this.chart) {
           this.updateChart();
       }
   }

   createChart() {
       const element = this.chartContainer.nativeElement;

   }

}


/* Note A>> .nativeElement() - The nativeElement can be used as an escape hatch when direct DOM manipulation is needed. Use this with caution, as it creates tight coupling between your application and the Browser, which will not work in WebWorkers.
*/
