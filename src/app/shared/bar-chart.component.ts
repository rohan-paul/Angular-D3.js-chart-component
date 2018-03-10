import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from "@angular/core";
import * as d3 from 'd3';

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.css'],
    encapsulation: ViewEncapsulation.None

})
// View encapsulation is set to “none” – this makes styling the chart component easier.

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

   // Initially create the chart with createChart()
   createChart() {
       const element = this.chartContainer.nativeElement;
       this.width = element.offsetWidth - this.margin.left - this.margin.right;
       this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
       const svg = d3.select(element).append('svg')
           .attr('width', element.offsetWidth)
           .attr('height', element.offsetHeight);

/* chart plot area.
https://stackoverflow.com/a/22965236/1902852
we use attr() to apply transform as an attribute of g. Translation transforms are specified with the easy syntax of translate(x,y), where x and y are, obviously, the number of horizontal and vertical pixels by which to translate the element.
*/
        this.chart = svg.append('g')
            .attr('class', 'bars')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        const xDomain = this.data.map(d => d[0]);
        const yDomain = [0, d3.max(this.data, d => d[1])];
/* d3.max() - https://goo.gl/v3xEUB
d.max() works by taking two arguments (https://github.com/d3/d3-array#max), the first is an array. And the second is an anonymous function you can use to tell d3.max() which values to consider when calculating the maximum. In this case, the array we are interested in is, this.data - the array holding chartData. But I dont want the maximum value associated with any property. The anonymous function, takes an argument d, and inside the anonymous function d represent every element of the array that is passed to d3.max
*/

        // Create Scales
        this.xScale = d3.scaleBand().padding(0.1).domain(xDomain).rangeRound([0, this.width]);
        this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

/*
A> Domain represents the boundaries within which your data lies. e.g. If I had an array of numbers with no number smaller than 1 and no number larger than 100, my domain would be 1 to 100.
A> https://github.com/d3/d3-scale#scaleBand
B> https://github.com/d3/d3-scale#band_rangeRound
C> range (https://github.com/d3/d3-scale#band_range) - I need to specify the boundaries within which my original data can be transformed. These boundaries are called the range. So, in this case e.g. the variable yScale's range is bounded by this.height and 0.
D> scale - The idea of scaling is to take the values of data that we have and to fit them into the space we have available.

*/

   }

   // Invoke updateChart() to re-render the chart, when the chart data has changed
   updateChart() {

   }

}


/* Note A>> .nativeElement() - The nativeElement can be used as an escape hatch when direct DOM manipulation is needed. Use this with caution, as it creates tight coupling between your application and the Browser, which will not work in WebWorkers.
*/
