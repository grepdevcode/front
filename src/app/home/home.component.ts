import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
    `.fondo{
      
    background-image: url(https://lh3.googleusercontent.com/pw/ACtC-3e-btCQfYhnkNATIR7MqpZUo6NazBw5wJjyv6edND_EmmQsreDjpPj_-dltMErrdIdW4CWkFxGFU0tzGISh4JKZzM3qQtwp8lSL75d0GVlafzI3v_DLMmwvdJ3JDbm1AmWPYeD1SaM31jjiqH0Cw0rO=w939-h626-no?authuser=0); /* The image used */
    background-color: #1A1A1B; /* Used if the image is unavailable */
    height: 490px; /* You must set a specified height */
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover; /* Resize the background image to cover the entire container */
    }
    `
  ]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  //"../../assets/fondo.jpg"
}
