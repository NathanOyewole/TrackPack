import React from 'react';

/**
 * Atom: Modal
 * A simple modal for confirmations and forms.
 */
export interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded shadow-lg p-6 min-w-[300px] relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
                {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
                {children}
            </div>
        </div>
    );
};

export default Modal; 
