import { motion } from "framer-motion";

type props = { message: string };
export const Exclamation = ({ message }: props) => {
  return (
    <motion.li
      initial={{ opacity: 1, transform: "translatey(-5px)" }}
      animate={{
        opacity: 0.0,
        transform: "translatey(190px)",
        transition: { duration: 5 },
      }}
      exit={{ opacity: 0, transform: "translatey(90px)",  transition: { duration: 2 } }}
    >
      {message}
    </motion.li>
  );
};
