import { motion } from "framer-motion";
const Connector = ({ filled }: { filled: boolean }) => {
  return (
    <div className="relative w-14 h-[3px] flex-shrink-0">
      <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: 'linear-gradient(90deg,#c89b3c,#f0d060)', transformOrigin: 'left center' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: filled ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  )
}

export default Connector