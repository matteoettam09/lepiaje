"use client";

import { useEffect } from "react";

export default function PropertyTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  return children;
}
