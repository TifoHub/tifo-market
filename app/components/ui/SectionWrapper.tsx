import React from "react";

interface SectionWrapperProps {
  children: React.ReactNode;
}

export default function SectionWrapper({ children }: SectionWrapperProps) {
  return (
    <section className="relative h-screen flex items-center justify-center -mx-6 md:-mx-16 w-[calc(100vw)]">
      {children}
    </section>
  );
}