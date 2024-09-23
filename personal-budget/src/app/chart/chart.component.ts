import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
//import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import axios from 'axios';
import * as d3 from 'd3';
import { ChartItem, registerables } from 'chart.js/auto';

interface BudgetItem {
  title: string;
  budget: number;
}

@Component({
  selector: 'pb-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})

export class ChartComponent implements OnInit {

  @ViewChild('myChart', { static: true }) chartElement!: ElementRef;
  @ViewChild('d3Chart', { static: true }) d3ChartElement!: ElementRef;

  dataSource = {
    datasets: [
      {
        data: [] as number[], 
        backgroundColor: [
          '#ffcd56', '#ff6384', '#36a2eb', '#fd6b19',
          '#84DCCF', '#3A1772', '#EFC7E5', '#CFEE9E', '#B97375'
        ]
      }
    ],
    labels: [] as string[]
  };

  constructor(private http: HttpClient){}

  ngOnInit(): void {
    this.getBudget();
    //this.createChart();
    this.createD3Chart();   
  }

  getBudget(): void {
    this.http.get<{ myBudget: BudgetItem[] }>('assets/budget.json')
    .subscribe(
      (res) => {
        console.log(res); // Check the output
        if (res.myBudget) {
          this.dataSource.datasets[0].data = res.myBudget.map(item => item.budget);
          this.dataSource.labels = res.myBudget.map(item => item.title);
          this.createChart(); // Call createChart after data is loaded
        }
      },
      (error) => {
        console.error('Error fetching budget data', error);
      }
    );
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

  
  createD3Chart(): void {
    const svg = d3.select(this.d3ChartElement.nativeElement)
      .attr('width', 400)
      .attr('height', 400);

    const radius = Math.min(400, 400) / 2;
    const g = svg.append('g')
      .attr('transform', 'translate(' + radius + ',' + radius + ')');

    const pie = d3.pie<any>().value((d: any) => d.budget);
    const arc = d3.arc<d3.PieArcDatum<any>>().outerRadius(radius - 10).innerRadius(0);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    
    // Static data for D3 chart
    const data = [
      { title: 'Eat out', budget: 25 },
      { title: 'Rent', budget: 275 },
      { title: 'Grocery', budget: 110 },
      { title: 'Utilities', budget: 100 },
      { title: 'Subscriptions', budget: 61 },
      { title: 'Travel', budget: 79 },
      { title: 'Mortgage', budget: 137 }
    ];

    const arcs = g.selectAll('.arc')
      .data(pie(data))
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
  

//end of class
} 