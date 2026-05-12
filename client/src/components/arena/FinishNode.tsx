import { motion, AnimatePresence } from "framer-motion";

const FinishNode = ({
  done,
  bonusGranted,
}: {
  done: boolean;
  bonusGranted: boolean;
}) => {
  return (
    <motion.div
      className="relative w-16 h-16 rounded-[14px] border-2 flex items-center justify-center flex-shrink-0"
      style={{
        borderColor: done ? "#c89b3c" : "rgba(200,155,60,0.2)",
        background: done ? "rgba(200,155,60,0.15)" : "rgba(200,155,60,0.05)",
        boxShadow: done ? "0 0 20px rgba(200,155,60,0.3)" : undefined,
      }}
      animate={done ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {done ? (
        <motion.span
          className="text-2xl leading-none"
          style={{ color: "#f0d060" }}
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 280, delay: 0.1 }}
        >
          ★
        </motion.span>
      ) : (
        <span
          className="text-xl leading-none"
          style={{ color: "rgba(200,155,60,0.3)" }}
        >
          ⚑
        </span>
      )}

      <AnimatePresence>
        {bonusGranted && (
          <motion.span
            className="absolute -top-2.5 -right-2.5 text-[9px] font-black px-1.5 py-0.5 rounded-full"
            style={{
              background: "linear-gradient(135deg,#c89b3c,#f0d060)",
              color: "#0d0f14",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            +20
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FinishNode;
