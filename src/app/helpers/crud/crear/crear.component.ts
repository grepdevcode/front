import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup,Validators  } from '@angular/forms';
//import form_template from '../../../interfaces/cocina';


@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {

  @Input() form_template:any[];
  myFormGroup:FormGroup;
  formTemplate:any; 
  labelDropDown:string;
  
  constructor() { }

  ngOnInit() {
    console.log(this.form_template)
    this.formTemplate= this.form_template; 
    let group={}    
    this.form_template.forEach(input_template=>{
      group[input_template.label]=new FormControl('');  
    })
    this.myFormGroup = new FormGroup(group);
  }




   onSubmit(){
    console.log(this.myFormGroup.value);
  }

  onChangeDropDown($event){
    console.log($event.target.value);
    this.labelDropDown = $event.target.value
  }

}
