import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataService, BudgetItem } from '../data.service';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';

@Component({
  selector: 'pb-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'] // Fix: changed styleUrl to styleUrls
})
export class ChartComponent implements OnInit {

  @ViewChild('myChart', { static: true }) chartElement!: ElementRef;
  @ViewChild('d3Chart', { static: true }) d3ChartElement!: ElementRef;

  dataSource: { datasets: any[]; labels: string[] } = {
    datasets: [],
    labels: []
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getBudgetData().subscribe(data => {
      this.dataSource = {
        datasets: [{
          data: data.map(item => item.budget),
          backgroundColor: [
            '#ffcd56', '#ff6384', '#36a2eb', '#fd6b19',
            '#84DCCF', '#3A1772', '#EFC7E5', '#CFEE9E', '#B97375'
          ]
        }],
        labels: data.map(item => item.title)
      };

      this.createChart();
      this.createD3Chart(data); // Pass data to createD3Chart
    });
  }

  createChart(): void {
    const ctx = this.chartElement.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: this.dataSource,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  createD3Chart(data: BudgetItem[]): void { // Accept data as a parameter
    const svg = d3.select(this.d3ChartElement.nativeElement)
      .attr('width', 400)
      .attr('height', 400);

    const radius = Math.min(400, 400) / 2;
    const g = svg.append('g')
      .attr('transform', 'translate(' + radius + ',' + radius + ')');

    const pie = d3.pie<BudgetItem>().value((d: BudgetItem) => d.budget);
    const arc = d3.arc<d3.PieArcDatum<BudgetItem>>().outerRadius(radius - 10).innerRadius(0);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const arcs = g.selectAll('.arc')
      .data(pie(data)) // Use the data parameter
      .enter().append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc as any)
      .style('fill', (d: any) => color(d.data.title));

    arcs.append('text')
      .attr('transform', (d: any) => 'translate(' + arc.centroid(d) + ')')
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .text((d: any) => d.data.title);
  }
}
