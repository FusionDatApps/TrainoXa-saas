const { prisma } = require("../../config/prisma");

async function getAuthenticatedTrainerProfile(authUser) {
  if (!authUser || !authUser.id) {
    const error = new Error("Usuario autenticado invalido");
    error.statusCode = 401;
    throw error;
  }

  if (authUser.role !== "TRAINER") {
    const error = new Error(
      "Acceso solo permitido para entrenadores"
    );

    error.statusCode = 403;

    throw error;
  }

  const trainerProfile =
    await prisma.trainerProfile.findUnique({
      where: {
        userId: authUser.id,
      },
    });

  if (!trainerProfile) {
    const error = new Error(
      "Perfil de entrenador no encontrado"
    );

    error.statusCode = 404;

    throw error;
  }

  return trainerProfile;
}

async function createWorkout({
  authUser,
  name,
  description,
}) {
  const trainerProfile =
    await getAuthenticatedTrainerProfile(
      authUser
    );

  return prisma.workoutPlan.create({
    data: {
      trainerId: trainerProfile.id,
      name,
      description,
    },
  });
}

async function getWorkouts(authUser) {
  const trainerProfile =
    await getAuthenticatedTrainerProfile(
      authUser
    );

  return prisma.workoutPlan.findMany({
    where: {
      trainerId: trainerProfile.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getWorkoutById({
  authUser,
  workoutId,
}) {
  const trainerProfile =
    await getAuthenticatedTrainerProfile(
      authUser
    );

  return prisma.workoutPlan.findFirst({
    where: {
      id: workoutId,
      trainerId: trainerProfile.id,
    },
  });
}

async function addExerciseToWorkout({
  authUser,
  workoutId,
  data,
}) {
  const trainerProfile =
    await getAuthenticatedTrainerProfile(
      authUser
    );

  const workout =
    await prisma.workoutPlan.findFirst({
      where: {
        id: workoutId,
        trainerId: trainerProfile.id,
      },
    });

  if (!workout) {
    const error = new Error(
      "Rutina no encontrada"
    );

    error.statusCode = 404;

    throw error;
  }

  const exercise =
    await prisma.exercise.findFirst({
      where: {
        id: data.exerciseId,
        trainerId: trainerProfile.id,
      },
    });

  if (!exercise) {
    const error = new Error(
      "Ejercicio no encontrado o no pertenece al entrenador"
    );

    error.statusCode = 404;

    throw error;
  }

  const existingExercise =
    await prisma.workoutPlanExercise.findFirst({
      where: {
        workoutPlanId: workoutId,
        exerciseId: data.exerciseId,
      },
    });

  if (existingExercise) {
    const error = new Error(
      "Este ejercicio ya fue agregado a la rutina"
    );

    error.statusCode = 409;

    throw error;
  }

  const duplicatedOrder =
    await prisma.workoutPlanExercise.findFirst({
      where: {
        workoutPlanId: workoutId,
        exerciseOrder:
          data.exerciseOrder,
      },
    });

  if (duplicatedOrder) {
    const error = new Error(
      "Ya existe un ejercicio con ese orden dentro de la rutina"
    );

    error.statusCode = 409;

    throw error;
  }

  return prisma.workoutPlanExercise.create({
    data: {
      workoutPlanId: workoutId,
      exerciseId: data.exerciseId,
      exerciseOrder:
        data.exerciseOrder,
      sets: data.sets,
      reps: data.reps,
      restSeconds:
        data.restSeconds,
      notes: data.notes,
    },

    include: {
      exercise: true,
    },
  });
}

async function getWorkoutExercises({
  authUser,
  workoutId,
}) {
  const trainerProfile =
    await getAuthenticatedTrainerProfile(
      authUser
    );

  const workout =
    await prisma.workoutPlan.findFirst({
      where: {
        id: workoutId,
        trainerId: trainerProfile.id,
      },
    });

  if (!workout) {
    const error = new Error(
      "Rutina no encontrada"
    );

    error.statusCode = 404;

    throw error;
  }

  return prisma.workoutPlanExercise.findMany({
    where: {
      workoutPlanId: workoutId,
    },

    include: {
      exercise: true,
    },

    orderBy: {
      exerciseOrder: "asc",
    },
  });
}

async function updateWorkoutExercise({
  authUser,
  workoutId,
  workoutExerciseId,
  data,
}) {
  const trainerProfile =
    await getAuthenticatedTrainerProfile(
      authUser
    );

  const workout =
    await prisma.workoutPlan.findFirst({
      where: {
        id: workoutId,
        trainerId: trainerProfile.id,
      },
    });

  if (!workout) {
    const error = new Error(
      "Rutina no encontrada"
    );

    error.statusCode = 404;

    throw error;
  }

  const workoutExercise =
    await prisma.workoutPlanExercise.findFirst({
      where: {
        id: workoutExerciseId,
        workoutPlanId: workoutId,
      },
    });

  if (!workoutExercise) {
    const error = new Error(
      "Ejercicio de rutina no encontrado"
    );

    error.statusCode = 404;

    throw error;
  }

  const duplicatedOrder =
    await prisma.workoutPlanExercise.findFirst({
      where: {
        workoutPlanId: workoutId,
        exerciseOrder:
          data.exerciseOrder,

        NOT: {
          id: workoutExerciseId,
        },
      },
    });

  if (duplicatedOrder) {
    const error = new Error(
      "Ya existe un ejercicio con ese orden dentro de la rutina"
    );

    error.statusCode = 409;

    throw error;
  }

  return prisma.workoutPlanExercise.update({
    where: {
      id: workoutExerciseId,
    },

    data: {
      exerciseOrder:
        data.exerciseOrder,
      sets: data.sets,
      reps: data.reps,
      restSeconds:
        data.restSeconds,
      notes: data.notes,
    },

    include: {
      exercise: true,
    },
  });
}

async function reorderWorkoutExercises({
  authUser,
  workoutId,
  items,
}) {
  const trainerProfile =
    await getAuthenticatedTrainerProfile(
      authUser
    );

  const workout =
    await prisma.workoutPlan.findFirst({
      where: {
        id: workoutId,
        trainerId: trainerProfile.id,
      },
    });

  if (!workout) {
    const error = new Error(
      "Rutina no encontrada"
    );

    error.statusCode = 404;

    throw error;
  }

  const existingItems =
    await prisma.workoutPlanExercise.findMany({
      where: {
        workoutPlanId: workoutId,
      },
    });

  const existingIds = new Set(
    existingItems.map((item) => item.id)
  );

  for (const item of items) {
    if (!existingIds.has(item.id)) {
      const error = new Error(
        "Ejercicio invalido dentro del reorder"
      );

      error.statusCode = 400;

      throw error;
    }
  }

  await prisma.$transaction(
    async (tx) => {
      for (const existing of existingItems) {
        await tx.workoutPlanExercise.update({
          where: {
            id: existing.id,
          },

          data: {
            exerciseOrder:
              existing.exerciseOrder +
              1000,
          },
        });
      }

      for (const item of items) {
        await tx.workoutPlanExercise.update({
          where: {
            id: item.id,
          },

          data: {
            exerciseOrder:
              item.exerciseOrder,
          },
        });
      }
    }
  );

  return prisma.workoutPlanExercise.findMany({
    where: {
      workoutPlanId: workoutId,
    },

    include: {
      exercise: true,
    },

    orderBy: {
      exerciseOrder: "asc",
    },
  });
}

async function removeWorkoutExercise({
  authUser,
  workoutId,
  workoutExerciseId,
}) {
  const trainerProfile =
    await getAuthenticatedTrainerProfile(
      authUser
    );

  const workout =
    await prisma.workoutPlan.findFirst({
      where: {
        id: workoutId,
        trainerId: trainerProfile.id,
      },
    });

  if (!workout) {
    const error = new Error(
      "Rutina no encontrada"
    );

    error.statusCode = 404;

    throw error;
  }

  const workoutExercise =
    await prisma.workoutPlanExercise.findFirst({
      where: {
        id: workoutExerciseId,
        workoutPlanId: workoutId,
      },
    });

  if (!workoutExercise) {
    const error = new Error(
      "Ejercicio de rutina no encontrado"
    );

    error.statusCode = 404;

    throw error;
  }

  await prisma.$transaction(
    async (tx) => {
      await tx.workoutPlanExercise.delete({
        where: {
          id: workoutExerciseId,
        },
      });

      const remainingExercises =
        await tx.workoutPlanExercise.findMany({
          where: {
            workoutPlanId: workoutId,
          },

          orderBy: {
            exerciseOrder: "asc",
          },
        });

      for (
        let index = 0;
        index < remainingExercises.length;
        index++
      ) {
        const item = remainingExercises[index];

        await tx.workoutPlanExercise.update({
          where: {
            id: item.id,
          },

          data: {
            exerciseOrder: index + 1,
          },
        });
      }
    }
  );

  return prisma.workoutPlanExercise.findMany({
    where: {
      workoutPlanId: workoutId,
    },

    include: {
      exercise: true,
    },

    orderBy: {
      exerciseOrder: "asc",
    },
  });
}
module.exports = {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  addExerciseToWorkout,
  getWorkoutExercises,
  updateWorkoutExercise,
  reorderWorkoutExercises,
  removeWorkoutExercise,
};