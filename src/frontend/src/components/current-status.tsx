"use client";

import styles from "./current-status.module.css";

interface CurrentStatusProps {
  dict: any;
}

export default function CurrentStatus({ dict }: CurrentStatusProps) {
  const status = dict.status;

  return (
    <section className={styles.statusSection}>
      <div className={styles.statusCard}>
        <div className={styles.header}>
          <h3 className={styles.title}>{status.heading}</h3>
          <div className={styles.badge}>
            <span className={styles.pulseDot} />
            <span className={styles.badgeText}>{status.availability}</span>
          </div>
        </div>
        
        <div className={styles.grid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>{status.location_label}</span>
            <span className={styles.value}>📍 {status.location}</span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.label}>{status.target_label}</span>
            <span className={styles.value}>🎯 {status.target}</span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.label}>{status.focus_label}</span>
            <span className={styles.value}>🔬 {status.focus}</span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.label}>{status.latest_label}</span>
            <span className={styles.value}>🚀 {status.latest}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
