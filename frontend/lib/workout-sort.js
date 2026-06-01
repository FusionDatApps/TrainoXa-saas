import { arrayMove } from "@dnd-kit/sortable";

export function normalizeExerciseOrder(items = []) {
  return items.map((item, index) => ({
    ...item,
    exerciseOrder: index + 1,
  }));
}

export function reorderWorkoutExercises({
  items = [],
  activeId,
  overId,
}) {
  if (!activeId || !overId || activeId === overId) {
    return normalizeExerciseOrder(items);
  }

  const oldIndex = items.findIndex(
    (item) => item.id === activeId
  );

  const newIndex = items.findIndex(
    (item) => item.id === overId
  );

  if (oldIndex === -1 || newIndex === -1) {
    return normalizeExerciseOrder(items);
  }

  const reordered = arrayMove(
    items,
    oldIndex,
    newIndex
  );

  return normalizeExerciseOrder(reordered);
}