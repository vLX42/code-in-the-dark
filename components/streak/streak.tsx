import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Exclamation } from "./exclamation";
import { Timer } from "./timer";
import styles from "./style.module.scss";
import { motion } from "framer-motion";

const EXCLAMATIONS = [
  "Super!",
  "Radical!",
  "Fantastic!",
  "Great!",
  "OMG",
  "Whoah!",
  ":O",
  "Nice!",
  "Splendid!",
  "Wild!",
  "Grand!",
  "Impressive!",
  "Stupendous!",
  "Extreme!",
  "Awesome!",
];
const EXCLAMATION_EVERY = 10;

type props = { streak: number; powerMode: boolean };
export const Streak = ({ streak, powerMode }: props) => {
  const [exclamation, setExclamation] = useState<string | null>(null);

  useEffect(() => {
    if (streak > 0 && streak % EXCLAMATION_EVERY === 0) {
      setExclamation(
        EXCLAMATIONS[Math.floor(streak / EXCLAMATION_EVERY) % EXCLAMATION_EVERY]
      );
    }
  }, [streak]);

  return (
    <>
      {powerMode && <h1 className={styles.powerMode}>POWER MODE!</h1>}
    <div className={`${styles.streak} streak`}>

      <h1>Combo</h1>
      <h2>
        <motion.div
          key={streak}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1, transition: { duration: 0.3 } }}
        >
          {streak}
        </motion.div>
        <AnimatePresence>
          <Timer streak={streak} />
        </AnimatePresence>
      </h2>

      <ul>
        <AnimatePresence>
          {exclamation && (
            <Exclamation key={exclamation} message={exclamation} />
          )}
        </AnimatePresence>
      </ul>
    </div>
    </>
  );
};
