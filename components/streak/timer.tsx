import React, { useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./style.module.scss";

type props = { streak: number };
export const Timer = ({ streak }: props) => {
  return (
    <div className={styles.timer}>
      <motion.div
        className={`${styles.timerInner} TimerInner`}
        key={streak}
        initial={{ width: streak > 0 ? "100%" : 0 }}
        animate={{ width: 0, transition: { duration: 10 } }}
      />
    </div>
  );
};
