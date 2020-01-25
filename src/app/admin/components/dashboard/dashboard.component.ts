import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet, ActivationStart, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  @ViewChild(RouterOutlet,null) outlet: RouterOutlet;

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe(e => {
      if (e instanceof ActivationStart && e.snapshot.outlet === "dashoutlet")
        this.outlet.deactivate();
    });
  }

}
