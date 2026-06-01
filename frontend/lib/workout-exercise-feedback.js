export function getAddExerciseErrorMessage(error) {
  if (
    error?.message ===
    "Este ejercicio ya fue agregado a la rutina"
  ) {
    return "Ese ejercicio ya existe dentro de la rutina";
  }

  if (
    error?.message ===
    "Ya existe un ejercicio con ese orden dentro de la rutina"
  ) {
    return "Ese numero de orden ya esta ocupado";
  }

  return (
    error?.message ||
    "No se pudo agregar el ejercicio"
  );
}

export function getUpdateExerciseErrorMessage(error) {
  if (
    error?.message ===
    "Ya existe un ejercicio con ese orden dentro de la rutina"
  ) {
    return "Ese numero de orden ya esta ocupado";
  }

  return (
    error?.message ||
    "No se pudo actualizar el ejercicio"
  );
}

export function getRemoveExerciseErrorMessage(error) {
  return (
    error?.message ||
    "No se pudo eliminar el ejercicio de la rutina"
  );
}

export function getReorderExerciseErrorMessage(error) {
  return (
    error?.message ||
    "Error actualizando el orden."
  );
}