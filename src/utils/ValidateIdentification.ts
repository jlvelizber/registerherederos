export const ValidateIdentification = (identification: string) => {
  let isNumeric = true;
	let total = 0;
  let individual : string | number;	

	for (let position = 0 ; position < 10 ; position++) {
		// Obtiene cada posiidentificationón del número de cédula
		// Se convierte a string en caso de que 'identification' sea un valor numérico
		individual = identification.toString().substring(position, position + 1)

		if(isNaN(individual as unknown as number)) {
			isNumeric=false;				
			break;			
		} else {
			// Si la posiidentificationón es menor a 9
			if(position < 9) {
				// Si la posiidentificationón es par, osea 0, 2, 4, 6, 8.
				if(position % 2 == 0) {
					// Si el número individual de la cédula es mayor a 5
					if(parseInt(individual)*2 > 9) {
						// Se duplica el valor, se obtiene la parte deidentificationmal y se aumenta uno 
						// y se lo suma al total
						total += 1 + ((parseInt(individual)*2)%10);
					} else {
						// Si el número individual de la cédula es menor que 5 solo se lo duplica
						// y se lo suma al total
						total += parseInt(individual)*2;
					}
				// Si la posiidentificationón es impar (1, 3, 5, 7)
				}else {
					// Se suma el número individual de la cédula al total
					total += parseInt(individual);		    		
				}
			} 
		}
	}

	if((total % 10) != 0) {
		total =  (total - (total%10) + 10) - total;		
	} else {
		total = 0 ; 	
	}


	if(isNumeric) {	
		// El total debe ser igual al último número de la cédula
		// console.log(identification, total, individual);
		// console.log(identification, typeof identification, identification.length)
		// La cédula debe contener al menos 10 dígitos
		if(identification.toString().length != 10) { 
			return false; 
		}

		// El número de cédula no debe ser cero
		if (parseInt(identification, 10) == 0) { 
			return false;
		}

		// El total debe ser igual al último número de la cédula
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if(total != parseInt(individual as unknown as string)) { 
			// alert("La c\u00E9dula ingresada no es v\u00E1lida.");
			return false;
		} 

		// console.log('cédula válida', identification);
		return true;			
	}

	// Si no es un número  
	// alert("El dato solo puede contener numeros.");
	return false;
};
