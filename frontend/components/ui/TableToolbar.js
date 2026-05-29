"use client";

import ContentStack from "./ContentStack";
import InlineGroup from "./InlineGroup";
import SearchInput from "./SearchInput";

export default function TableToolbar({
  title,
  description,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  children,
}) {
  return (
    <ContentStack gap={16}>
      <InlineGroup justify="space-between" align="flex-start">
        <div>
          {title ? <h2 style={styles.title}>{title}</h2> : null}

          {description ? (
            <p style={styles.description}>
              {description}
            </p>
          ) : null}
        </div>

        {children ? (
          <InlineGroup gap={10}>
            {children}
          </InlineGroup>
        ) : null}
      </InlineGroup>

      {onSearchChange ? (
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      ) : null}
    </ContentStack>
  );
}

const styles = {
  title: {
    margin: "0 0 6px 0",
    color: "#f8fafc",
    fontSize: "24px",
    fontWeight: "900",
  },

  description: {
    margin: 0,
    color: "#94a3b8",
    lineHeight: 1.5,
  },
};