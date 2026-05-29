export const TOAST_MESSAGES = {
  createSuccess: {
    title: "Registro creado",
    message: "La informacion se guardo correctamente.",
  },
  updateSuccess: {
    title: "Cambios guardados",
    message: "La informacion fue actualizada correctamente.",
  },
  deleteSuccess: {
    title: "Registro eliminado",
    message: "La informacion fue eliminada correctamente.",
  },
  genericError: {
    title: "Algo salio mal",
    message: "No se pudo completar la accion. Intenta nuevamente.",
  },
};

export function getApiErrorMessage(error, fallback = TOAST_MESSAGES.genericError.message) {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  return fallback;
}

export function buildToastPayload({ title, message, fallbackMessage }) {
  return {
    title: title || TOAST_MESSAGES.genericError.title,
    message: message || fallbackMessage || TOAST_MESSAGES.genericError.message,
  };
}

export const CONFIRM_COPY = {
  deleteWorkout: {
    title: "Eliminar rutina",
    description:
      "Esta accion eliminara la rutina seleccionada. Verifica antes de continuar.",
    confirmText: "Eliminar rutina",
    cancelText: "Cancelar",
  },
  deleteClient: {
    title: "Eliminar cliente",
    description:
      "Esta accion eliminara el cliente seleccionado del panel operativo.",
    confirmText: "Eliminar cliente",
    cancelText: "Cancelar",
  },
};
