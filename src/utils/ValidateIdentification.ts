export const ValidateIdentification = (identification: string) => {
  let identificationCorrecta = false;
  if (identification.length == 10) {
    let tercerDigito = parseInt(identification.substring(2, 3));
    if (tercerDigito < 6) {
      // El ultimo digito se lo considera dígito verificador
      let coefValCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];
      let verificador = parseInt(identification.substring(9, 10));
      let suma: number = 0;
      let digito: number = 0;
      for (let i = 0; i < identification.length - 1; i++) {
        digito =
          parseInt(identification.substring(i, i + 1)) * coefValCedula[i];
        suma += parseInt((digito % 10) + "") + parseInt(digito / 10 + "");
        //      console.log(suma+" suma"+coefValCedula[i]);
      }
      suma = Math.round(suma);
      //  console.log(verificador);
      //  console.log(suma);
      //  console.log(digito);
      if (Math.round(suma % 10) == 0 && Math.round(suma % 10) == verificador) {
        identificationCorrecta = true;
      } else if (10 - Math.round(suma % 10) == verificador) {
        identificationCorrecta = true;
      } else {
        identificationCorrecta = false;
      }
    } else {
      identificationCorrecta = false;
    }
  } else {
    identificationCorrecta = false;
  }
  
  return identificationCorrecta
};
