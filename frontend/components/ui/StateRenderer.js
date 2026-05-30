import EmptyState from "./EmptyState";
import FeedbackMessage from "./FeedbackMessage";
import SkeletonCard, { SkeletonGrid } from "./SkeletonCard";

export default function StateRenderer({
  loading = false,
  error = "",
  isEmpty = false,
  emptyMessage = "No hay datos disponibles.",
  loadingMessage = "Cargando informacion...",
  loadingVariant = "card",
  skeletonCount = 4,
  skeletonHeight = 180,
  children,
}) {
  if (loading) {
    if (loadingVariant === "grid") {
      return (
        <SkeletonGrid
          count={skeletonCount}
          height={skeletonHeight}
        />
      );
    }

    return (
      <SkeletonCard height={skeletonHeight}>
        {loadingMessage}
      </SkeletonCard>
    );
  }

  if (error) {
    return (
      <FeedbackMessage variant="error">
        {error}
      </FeedbackMessage>
    );
  }

  if (isEmpty) {
    return (
      <EmptyState>
        {emptyMessage}
      </EmptyState>
    );
  }

  return children;
}
