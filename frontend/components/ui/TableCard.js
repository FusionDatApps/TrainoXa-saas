"use client";

import SectionCard from "./SectionCard";
import ContentStack from "./ContentStack";

export default function TableCard({
  children,
  toolbar,
}) {
  return (
    <SectionCard>
      <ContentStack gap={22}>
        {toolbar}

        {children}
      </ContentStack>
    </SectionCard>
  );
}