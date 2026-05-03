/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
interface ToastProps {
  toast: { msg: string; type: "success" | "danger" } | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#22222a] border-[1.5px] rounded-linear p-[10px_20px] text-[13px] font-medium z-[999] pointer-events-none whitespace-nowrap shadow-xl rounded-xl ${
            toast.type === "danger"
              ? "border-[#e24b4a66] text-[#e24b4a]"
              : "border-[#1d9e7566] text-[#1d9e75]"
          }`}
        >
          {toast.type === "danger" ? "✕" : "✓"} {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
