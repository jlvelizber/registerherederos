export const esLang = {
  mixed: {
    default: "No es válido",
    required: "Este campo es requerido",
    oneOf: "Debe ser uno de los siguientes valores: ${values}",
    notOneOf: "No puede ser uno de los siguientes valores: ${values}",
  },
  string: {
    length: "Debe tener exactamente ${length} caracteres",
    min: "Debe tener al menos ${min} caracteres",
    max: "Debe tener como máximo ${max} caracteres",
    email: "Debe ser una dirección de correo electrónico válida",
    url: "Debe ser una URL válida",
    trim: "No debe contener espacios al inicio o al final",
    lowercase: "Debe estar en minúsculas",
    uppercase: "Debe estar en mayúsculas",
    verifyIdentification:'Indentificación inválida'
  },
  number: {
    min: "Debe ser mayor o igual a ${min}",
    max: "Debe ser menor o igual a ${max}",
    lessThan: "Debe ser menor que ${less}",
    moreThan: "Debe ser mayor que ${more}",
    // notEqual: "No puede ser igual a ${notEqual}",
    positive: "Debe ser un número positivo",
    negative: "Debe ser un número negativo",
    integer: "Debe ser un número entero",
  },
  date: {
    min: "Debe ser posterior a ${min}",
    max: "Debe ser anterior a ${max}",
  },
  array: {
    min: "Debe tener al menos ${min} elementos",
    max: "Debe tener como máximo ${max} elementos",
  },
};
