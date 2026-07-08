"use client";

import styles from "../app/[locale]/home.module.css";

interface AssistantTriggerProps {
  isAr: boolean;
}

export function AssistantTrigger({ isAr }: AssistantTriggerProps) {
  const triggerChat = () => {
    window.dispatchEvent(new CustomEvent("open-chat"));
  };

  return (
    <button type="button" onClick={triggerChat} className={styles.chip}>
      💬 {isAr ? "تحدث مع المساعد العائم" : "Open Floating Assistant"}
    </button>
  );
}
