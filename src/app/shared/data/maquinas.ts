export interface TiposMaquina {
  id: number;
  name: string;
  tipo: number;
}

export interface Maquinas {
  id: number;
  name: string;
  tipo: number;
}

export const tiposMaquina: TiposMaquina[] = [
  { id: 1, name: 'Máquinas de fuerza', tipo: 1 },
  { id: 2, name: 'Máquinas de cardio', tipo: 2 },
  { id: 3, name: 'Máquinas multifuncionales', tipo: 3 },
];

export const maquinas: Maquinas[] = [
  // Máquinas de fuerza (tipo: 1)
  { id: 1, name: 'Press de pecho', tipo: 1 },
  { id: 2, name: 'Pectoral Contractor', tipo: 1 },
  { id: 3, name: 'Remo sentado', tipo: 1 },
  { id: 4, name: 'Press de hombros', tipo: 1 },
  { id: 5, name: 'Polea alta', tipo: 1 },
  { id: 6, name: 'Remo bajo en polea', tipo: 1 },
  { id: 7, name: 'Extensión de piernas', tipo: 1 },
  { id: 8, name: 'Curl femoral', tipo: 1 },
  { id: 9, name: 'Prensa de piernas', tipo: 1 },
  { id: 10, name: 'Glúteo Kickback', tipo: 1 },
  { id: 11, name: 'Abductores', tipo: 1 },
  { id: 12, name: 'Aductores', tipo: 1 },
  { id: 13, name: 'Máquina de gemelos', tipo: 1 },
  { id: 14, name: 'Curl de bíceps', tipo: 1 },
  { id: 15, name: 'Tríceps pushdown', tipo: 1 },
  { id: 16, name: 'Multipower', tipo: 1 },

  // Máquinas de cardio (tipo: 2)
  { id: 17, name: 'Cinta de correr', tipo: 2 },
  { id: 18, name: 'Bicicleta estática', tipo: 2 },
  { id: 19, name: 'Bicicleta de spinning', tipo: 2 },
  { id: 20, name: 'Elíptica', tipo: 2 },
  { id: 21, name: 'Escaladora', tipo: 2 },
  { id: 22, name: 'Remo ergómetro', tipo: 2 },
  { id: 23, name: 'Air Bike', tipo: 2 },

  // Máquinas multifuncionales (tipo: 3)
  { id: 24, name: 'Jaula de potencia', tipo: 3 },
  { id: 25, name: 'Poleas cruzadas', tipo: 3 },
  { id: 26, name: 'Banco plano', tipo: 3 },
  { id: 27, name: 'Banco inclinado', tipo: 3 },
  { id: 28, name: 'Banco declinado', tipo: 3 },
  { id: 29, name: 'Máquina para abdominales', tipo: 3 },
  { id: 30, name: 'Espalda baja', tipo: 3 },
  { id: 31, name: 'Dominadas asistidas', tipo: 3 },
  { id: 32, name: 'Fondos asistidos', tipo: 3 },
];
