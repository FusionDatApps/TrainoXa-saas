export function extractApiError(error) {
  if (!error) {
    return "Ocurrió un error inesperado.";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  return "No fue posible procesar la solicitud.";
}

export function isEmptyValue(value) {
  return (
    value === null ||
    value === undefined ||
    value === ""
  );
}