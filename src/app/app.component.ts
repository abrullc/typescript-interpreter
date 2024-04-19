import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ElementReportInterface } from './element-report-interface';

interface IArreglo {
  name: string,
  dni: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'ts-interprete';

  inputValue: string = "";
  outputValue: string = "";
  code: string = "";
  expression: string = "";
  result: any;

  fileContent: string = '';
  @ViewChild('fileInput') fileInput: any;

  arreglo: IArreglo[] | undefined = [{
    name: "carlos",
    dni: "test"
  }];

  variable: string | undefined;

  context: any; // Contexto para la evaluación de expresiones

  constructor() { }

  ngOnInit(): void {
    this.initializeContext();
    // Ejemplo de evaluación de expresiones
    //const result = this.evaluateExpression('arreglo[0].name.toUpperCase() === "CARLOS"');
    //console.log(result); // Output: true
  }

  onClick(): void {
    this.interprete();
  }

  putExpression(expr: string): void {
    this.inputValue += "=" + expr+ "()";
  }

  interprete() {
    try {
      if (this.inputValue[0] == '=') {
        console.log("Es una función predefinida");

        this.code = this.inputValue.split("=")[1];
        console.log(this.code);

        this.expression = this.code.split("(")[0];
        console.log(this.expression);

        let data = this.code.split("(")[1].split(")")[0].split(",");
        console.log(data);

        if (this.expression == "SUM") {
          this.result = this.sum(data);
        } else if (this.expression == "RES") {
          this.result = this.res(data);
        } else if (this.expression == "MULT") {
          this.result = this.mult(data);
        } else if (this.expression == "DIV") {
          this.result = this.div(data);
        } else {
          this.result = "Función desconocida."
        }

        this.outputValue = this.result;

      } else {
        console.log("No es una función predefinida");

        let capturedLogs: string[] = []; // Array to capture console.log outputs

        // Construct the code with the input value wrapped inside a try-catch block
        let code: string = `
          (() => {
            try {
              const originalLog = console.log; // Store the original console.log function
              console.log = function() { // Override console.log to capture its outputs
                capturedLogs.push(Array.from(arguments).map(arg => arg.toString()).join(' '));
                originalLog.apply(console, arguments); // Call the original console.log function
              };

              ${this.inputValue}
            } catch (error) {
              console.log("Ha ocurrido un error:", error);
            }
          })();
        `;

        this.result = eval(code);

        // Assign the captured logs to the outputValue variable
        this.outputValue = capturedLogs.join('\n');
      }
    } catch (error) {
      this.outputValue = "Ha ocurrido un error: " + error;
    }
  }

  // Suma de elementos
  sum(data: string[]): number {
    let result: number = 0;

    for (let i = 0; i < data.length; i++) {
      result += +data[i].trim();
    }

    console.log(result);

    return result;
  }

  // Resta de elementos
  res(data: string[]): number {
    let result: number = +data[0].trim();

    for (let i = 1; i < data.length; i++) {
      result -= +data[i].trim();
    }

    console.log(result);

    return result;
  }

  // Multiplicación de elementos
  mult(data: string[]): number {
    let result: number = +data[0].trim();

    for (let i = 1; i < data.length; i++) {
      result *= +data[i].trim();
    }

    console.log(result);

    return result;
  }

  // División de elementos
  div(data: string[]): number {
    let result: number = +data[0].trim();

    for (let i = 1; i < data.length; i++) {
      result /= +data[i].trim();
    }

    console.log(result);

    return result;
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  importCode(event: any): void {
    const file: File = event.target.files[0];
    const fileReader: FileReader = new FileReader();

    fileReader.onload = (fileLoadedEvent: any) => {
      this.inputValue = fileLoadedEvent.target.result;
    };

    fileReader.readAsText(file);
  }

  exportCode(): void {
    const blob = new Blob([this.inputValue], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const fileName = window.prompt('Enter the file name:', 'code.ts');
    if (!fileName) return; // If the user cancels, do nothing

    const newFile = document.createElement('a');
    newFile.href = url;
    newFile.download = fileName;
    document.body.appendChild(newFile);
    newFile.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(newFile);
  }

  ngAfterViewInit(): void {
    // Ejemplo de evaluación de expresiones en ngAfterViewInit
    const result = this.evalexp(`arreglo && arreglo[0].name.toUpperCase() == "CARLOS"`);
    console.log(result); // Output: true
  }

  initializeContext(): void {
    // Inicializa el contexto con las variables y funciones iniciales
    this.context = {
      arreglo: this.arreglo,
      variable: this.variable,
      MAYOR: (...args: number[]) => Math.max(...args)
      // Puedes agregar más funciones aquí según tus requisitos
    };
  }

  /*evaluateExpression(expression: string): any {
    try {
      // Evalúa la expresión en el contexto dado
      return math.evaluate(expression, this.context);
    } catch (error) {
      console.error('Error evaluating expression:', error);
      return undefined;
    }
  }

  // Método para agregar nuevas variables al contexto de evaluación
  addVariablesToContext(newVariables: any): void {
    // Combina el contexto existente con las nuevas variables
    this.context = Object.assign({}, this.context, newVariables);
  }*/

  contexto = {};

  updateContext() {
    this.contexto = {
      exist: this.exist.bind(this),
      NotExist: !this.exist.bind(this),
      //funcion para devolver el contrario de un valor booleano
      not: (value: boolean) => !value,
      selectedItems: this.selectedItems,
    };
  }

  evalexp(expression: string): any {
    this.updateContext();
    return this.evaluateExpression(expression, this.contexto);
  }

  evaluateExpression(expression: string, contexto: any): any {
    try {
      // Extraer las claves y los valores del objeto 'contexto'
      const claves = Object.keys(contexto);
      const valores = Object.values(contexto);

      // Crear una nueva función que acepte las claves del contexto como argumentos
      const fn = new Function(
        ...claves,
        '"use strict"; return (' + expression + ')'
      );

      // Llamar a la nueva función pasando los valores del contexto como argumentos
      return fn(...valores);
    } catch (error) {
      // Capturar el error y mostrar solo el mensaje relevante
      if (error instanceof Error) {
        // Ahora puedes acceder a 'error.message' de manera segura
        console.error('Error al evaluar la expresión:', error.message);
      } else {
        // Manejar otros tipos de errores o valores desconocidos
        console.error(
          'Se produjo un error, pero no se pudo determinar el mensaje específico.'
        );
      }
      return false;
    }
  }

  exist(objeto: any): boolean {
    return (
      objeto !== undefined &&
      objeto !== null &&
      (Array.isArray(objeto) ? objeto.length > 0 : true)
    );
  }

  // {'width.px': 14, fill: selectedItems[0].fontProperties.alignH != 'justify' ? 'black' : 'white'}

  selectedItems: ElementReportInterface[] = []; // Elementos seleccionados
}
