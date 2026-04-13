import { NextPage } from "next";
import React, { useEffect, useState, useCallback } from "react";
import { EditorProps } from "../components/editor";
import { Button } from "../components/button";
import { useDebouncedCallback } from "use-debounce";
import { useEntryStore } from "../hooks/useEntryStore";
import { Streak } from "../components/streak/streak";
import { Modal } from "../components/modal";
import { eventId, reference_image, instructions } from "../config/event";
import { apiFetch } from "../lib/apiFetch";
import styles from "../styles/editor.module.scss";
import { useRouter } from "next/router";
import useInterval from "../hooks/useInterval";
import dynamic from "next/dynamic";

const Editor = dynamic<EditorProps>(
  () => import("../components/editor").then((mod) => mod.Editor),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const STREAK_TIMEOUT = 10 * 1000;
const POWER_MODE_ACTIVATION_THRESHOLD = 200;

const EditorView: NextPage = () => {
  const router = useRouter();
  const {
    entry,
    updateEntry,
    isSubmitted,
    updateIsSubmitted,
    updateIsLoading,
  } = useEntryStore();
  const [streak, setStreak] = useState(0);
  const [powerMode, setPowerMode] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showReference, setShowReference] = useState(false);

  const debouncedResetStreak = useDebouncedCallback(() => {
    setStreak(0);
    setPowerMode(false);
  }, STREAK_TIMEOUT);

  const handleChange = useCallback(
    (newValue: string) => {
      setStreak((prevStreak) => {
        const newStreak = prevStreak + 1;
        if (newStreak >= POWER_MODE_ACTIVATION_THRESHOLD) {
          setPowerMode(true);
        }
        return newStreak;
      });
      debouncedResetStreak();
      updateEntry({ html: newValue });
    },
    [debouncedResetStreak, updateEntry]
  );

  useInterval(() => {
    if (entry?.id) {
      apiFetch("timelap", {
        entryId: entry.id,
        html: entry.html,
        eventId: eventId,
        streak: streak,
        powerMode: powerMode,
      });
    }
  }, 15000);

  useEffect(() => {
    if (isSubmitted) {
      router.push("/thanks");
    }
  }, [isSubmitted, router]);

  const finishHandler = useCallback(async () => {
    if (entry?.id) {
      updateIsLoading(true);
      try {
        await apiFetch("save", {
          entryId: entry.id,
          html: entry.html,
          streak: streak,
          powerMode: powerMode,
        });
        updateIsSubmitted(true);
        router.push("/thanks");
      } catch (error) {
        console.error("Failed to save entry:", error);
        // Handle error appropriately
      } finally {
        updateIsLoading(false);
      }
    }
  }, [entry, streak, powerMode, updateIsLoading, updateIsSubmitted, router]);

  return (
    <div
      className={`${styles.editorView} ${
        powerMode ? styles.powerModeOuter : ""
      }`}
    >
      <Modal show={showInstructions} setShow={setShowInstructions}>
        <pre>{instructions}</pre>
      </Modal>
      <Modal show={showReference} setShow={setShowReference}>
        <img
          src={reference_image}
          className={styles.referenceImage}
          alt="Reference"
        />
      </Modal>
      <Streak streak={streak} powerMode={powerMode} />
      <div
        className={powerMode ? styles.backgroundPowerMode : styles.background}
      />

      <Editor
        onChange={handleChange}
        className={styles.editor}
        defaultValue={entry?.html || ""}
      />

      <div className={styles.editorViewNametag}>{entry?.handle}</div>

      <div className={styles.editorViewControls}>
        <div className={styles.editorViewReference}>
          Reference
          <div
            onClick={() => setShowReference(true)}
            className={styles.editorViewReferenceImage}
            style={{ backgroundImage: `url(${reference_image})` }}
          />
        </div>

        <div className={styles.editorViewButtons}>
          <Button
            onClick={() => setShowInstructions(true)}
            className={`${styles.editorViewButton} ${styles.editorViewButtonsInstructions}`}
          >
            Instructions
          </Button>
          <Button
            className={`${styles.editorViewButton} ${styles.editorViewButtonsFinish}`}
            onClick={finishHandler}
          >
            Finish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorView;
