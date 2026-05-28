"use client";

import ContentStack from "./ContentStack";

export default function PageSection({
  children,
  gap = 24,
  style = {},
}) {
  return (
    <section style={style}>
      <ContentStack gap={gap}>
        {children}
      </ContentStack>
    </section>
  );
}