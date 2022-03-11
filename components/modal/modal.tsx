import styles from "./styles.module.scss";
export const Modal = ({
  children,
  show,
  setShow,
}: {
  children: React.ReactNode;
  show: boolean;
  setShow: (value: boolean) => void;
}) => (
  <>
    {show && (
      <div className={styles.overlay} onClick={() => setShow(false)}>
        <div className={styles.modal}>
          <button
            className={styles.close}
            type="button"
            onClick={() => setShow(false)}
          >
            X
          </button>
          <div onClick={(e) =>  e.stopPropagation()} className={styles.body}>{children}</div>
        </div>
      </div>
    )}
  </>
);
