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
/* First, define the size of the drawing area on which we wish to represent the bar chart. The dimensions are specified by width and height variables, but I must also take the space for margins into account. These margin values must be subtracted from w and h, suitably restricting the area to be allocated to
your chart  */
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
A> In above step we define a scale on the x axis and y axis. I do not have numeric values on the x axis but string values identifying each bar as "index i". Thus, for this type of value, you have to define an ordinal scale.
In fact, the function < scaleBand().rangeRound([0, this.width]) > divides the range passed as argument into discrete bands.
For the y axis, since it represents a variable in numerical values, I simply choose a
linear scale. */

        // bar colors
        this.colors = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>['red', 'blue']);

/* A> https://github.com/d3/d3-scale/blob/master/README.md#continuous_domain
B> Here, our input values range from 0 to this.data.length, so thats our domain. And output values (i.e. the range) ranges between 'red' and 'blue' . */

        // Draw x axis with labels and move to the bottom of the chart area
        this.xAxis = svg.append('g')
            .attr('class', 'axis axis-x')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .call(d3.axisBottom(this.xScale));

        // Draw y axis with labels and move to the bottom of the chart area
        this.yAxis = svg.append('g')
            .attr('class', 'axis axis-y')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
            .call(d3.axisLeft(this.yScale));

/* A> < .attr('class', 'axis axis-x') > Two classes, one for css formatting, one for selection below

B> d3.axisBottom() - https://github.com/d3/d3-axis#axisBottom - Constructs a new bottom-oriented axis generator for the given scale
*/

   }

   // Invoke updateChart() to re-render the chart, when the chart data has changed
   updateChart() {
       // Update all scales and axis
       this.xScale.domain(this.data.map(d => d[0]));
       this.yScale.domain([0, d3.max(this.data, d => d[1])]);
       this.colors.domain(0, this.data.length);
       this.xAxis.transition().call(d3.axisBottom(this.xScale));
       this.yAxis.transition().call(d3.axisLeft(this.yScale));

       const update = this.chart.selectAll('.bar')
           .data(this.data);

    // remove exiting bars
    update.exit().remove();

    // update existing bars by adding the SVG elements which make up the bars
    

   }

}


/* Note A>> .nativeElement() - The nativeElement can be used as an escape hatch when direct DOM manipulation is needed. Use this with caution, as it creates tight coupling between your application and the Browser, which will not work in WebWorkers.
*/
