import EmptyState from "./EmptyState";
import FeedbackMessage from "./FeedbackMessage";
import SkeletonCard, { SkeletonGrid } from "./SkeletonCard";

export default function StateRenderer({
  loading = false,
  error = "",
  isEmpty = false,
  emptyMessage = "No hay datos disponibles.",
  emptyTitle = "No hay datos disponibles",
  emptyIcon = "○",
  emptyActionLabel,
  onEmptyAction,
  errorTitle = "No se pudo cargar la informacion",
  errorActionLabel = "Reintentar",
  onRetry,
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
      <FeedbackMessage
        variant="error"
        title={errorTitle}
        actionLabel={onRetry ? errorActionLabel : undefined}
        onAction={onRetry}
      >
        {error}
      </FeedbackMessage>
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyMessage}
        icon={emptyIcon}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return children;
}
