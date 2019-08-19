import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styles: []
})
export class DataComponent  {

  forma: FormGroup;

  usuario: Object = {
    nombreCompleto: {
      nombre: 'Adolfo',
      apellido: 'López'
    },
    correo: 'alopezcia@gmail.com',
    pasatiempos: []
  };

  constructor() {

    this.forma = new FormGroup({
      nombreCompleto: new FormGroup({
        nombre: new FormControl('Adolfo', [Validators.required, Validators.minLength(3)]),
        apellido: new FormControl('', [Validators.required, this.noLopez] )
      }),
      correo: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')] ),
      correo2: new FormControl(),
      pasatiempos: new FormArray([
    //    new FormControl('Correr', Validators.required)
      ]),
      username: new FormControl('', Validators.required, this.existeUsuario ),
      password1: new FormControl('', Validators.required),
      password2: new FormControl()
    });

    // this.forma.setValue(this.usuario);
    this.forma.controls['password2'].setValidators([
        Validators.required,
        // Javascript: el bind suplanta this en metodos fuera de contexto
        this.noIgual.bind( this.forma.controls['password1'] )
    ]);
    this.forma.controls['correo2'].setValidators([
      Validators.required,
      // Javascript: el bind suplanta this en metodos fuera de contexto
      this.noIgual.bind( this.forma.controls['correo'] )
    ]);

    // Crear un Observable  para que esté pendiente de  los cambios de la data
    // this.forma.valueChanges
    //   .subscribe( data => {
    //       console.log( data );
    //   });
    this.forma.controls['username'].valueChanges
      .subscribe( data => {
          console.log( data );
      });
    this.forma.controls['username'].statusChanges
      .subscribe( data => {
          console.log( data );
      });

  }

  guardarCambios(){
    console.log(this.forma.value);
    console.log(this.forma);
    this.forma.reset();
  }

  agregarPasatiempo(){
    (this.forma.controls['pasatiempos'] as FormArray).push(new FormControl('', Validators.required));
  }

  noLopez( control: FormControl ): { [s: string]: boolean } {
    if( control.value === 'lopez') {
      return { nolopez: true };
    }
    return null;
  }

  noIgual( control: FormControl ): { [s: string]: boolean } {
    // Este método esta invocado fuera del contexto, fuera del componente,
    // por lo que no se puede obtener this.controls
    let formControl: FormControl = this;
    if ( control.value !== formControl.value) {
      return { noigual: true };
    }
    return null;
  }

  // Validación asíncrona en el FormControl del nombre
  existeUsuario( control: FormControl ): Promise<any> | Observable<any> {
      let promesa = new Promise(
        (resolve, reject) => {
          setTimeout( ()=> {
            if( control.value === "strider"){
              resolve( {existe: true} );
            } else {
              resolve( null );
            }
          }, 3000 );
        }
      )
      return promesa;
  }

}
