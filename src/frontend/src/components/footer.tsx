import styles from "./footer.module.css";

interface FooterProps {
  dict: Record<string, Record<string, string>>;
}

/**
 * Footer — displays tech credits and copyright.
 */
export function Footer({ dict }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.content}`}>
        <p className={styles.tech}>{dict.footer.built_with}</p>
        <p className={styles.copyright}>{dict.footer.copyright}</p>
      </div>
    </footer>
  );
}
