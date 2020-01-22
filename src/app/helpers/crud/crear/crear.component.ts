import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators  } from '@angular/forms';
import form_template from '../../../intefaces/cocina';


@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {

  myFormGroup:FormGroup;
  formTemplate:any = form_template; 

  constructor() { }

  ngOnInit() {
    let group={}    
    form_template.forEach(input_template=>{
      group[input_template.label]=new FormControl('');  
    })
    this.myFormGroup = new FormGroup(group);
  }

   onSubmit(){
    console.log(this.myFormGroup.value);
  }

}
