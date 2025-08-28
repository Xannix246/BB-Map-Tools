import { Dialog, DialogPanel } from "@headlessui/react";
import clsx from "clsx";
import { motion } from "motion/react";

type Props = {
    children: React.ReactNode;
    className?: string;
    onClose?: () => void;
    open: boolean;
}

const Modal = ({ children, className, open, onClose }: Props) => {
    return (
        <div className="inset-0">
            <Dialog open={open} onClose={() => {if (onClose) onClose()}} className="relative z-50">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/30 backdrop-blur-[2px]"
                />
                <motion.div 
                    className="fixed inset-0 flex w-screen items-center justify-center p-4"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ ease: "backInOut", duration: 0.4 }}
                >
                    <DialogPanel className={clsx("max-w-full bg-white m-4 rounded-md", className)}>
                        {children}
                    </DialogPanel>
                </motion.div>
            </Dialog>
        </div>
    );
}

export default Modal;