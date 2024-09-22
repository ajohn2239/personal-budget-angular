import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit{

  public dataSource = {
    datasets: [
      {
          data: [] as number[],
          backgroundColor: [
              '#ffcd56',
              '#ff6384',
              '#36a2eb',
              '#fd6b19',
              '#84DCCF',
              '#3A1772',
              '#EFC7E5',
              '#CFEE9E',
              '#B97375'
          ]
      }
    ],
    labels: [] as string[],
  };
  
  constructor(private http: HttpClient){ }
  
  ngOnInit(): void {
     this.http.get('http://localhost:3000/budget')
     .subscribe((res: any) => {
      console.log(res);
      for (var i = 0; i < res.data.myBudget.length; i++) {
          //this.dataSource.datasets[0].data[i] = res.data.myBudget[i].budget;
          this.dataSource.datasets[0].data.push(res.myBudget[i].budget);
          //this.dataSource.labels[i] = res.data.myBudget[i].title;
          this.dataSource.labels.push(res.myBudget[i].title);
      }
      this.createChart();
     });
  }

  createChart() {
    //var ctx = document.getElementById('myChart').getContext('2d');
    var ctx = document.getElementById('myChart')as HTMLCanvasElement | null;
    var myPieChart = new Chart(ctx!, {
        type: 'pie',
        data: this.dataSource
    });
}

}
