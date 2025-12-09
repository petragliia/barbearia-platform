import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
    message: string;
    onClose: () => void;
    type?: 'success' | 'error';
}

export const Toast = ({ message, onClose, type = 'success' }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isError = type === 'error';

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-white text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border ${isError ? 'border-red-100' : 'border-gray-100'}`}
        >
            {isError ? (
                <AlertCircle size={20} className="text-red-500" />
            ) : (
                <CheckCircle2 size={20} className="text-green-500" />
            )}
            <span className="font-medium text-sm">{message}</span>
        </motion.div>
    );
};

export default Toast;
