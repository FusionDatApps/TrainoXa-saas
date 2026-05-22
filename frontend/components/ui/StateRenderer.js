import EmptyState from "./EmptyState";
import LoadingCard from "./LoadingCard";
import FeedbackMessage from "./FeedbackMessage";

export default function StateRenderer({
  loading = false,
  error = "",
  isEmpty = false,
  emptyMessage = "No hay datos disponibles.",
  loadingMessage = "Cargando información...",
  children,
}) {
  if (loading) {
    return (
      <LoadingCard>
        {loadingMessage}
      </LoadingCard>
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