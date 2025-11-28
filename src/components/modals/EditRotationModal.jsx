// src/components/modals/EditRotationModal.jsx
import { useState, useEffect } from "react";
import { useStore } from "../../context/StoreProvider";
import { toast } from 'sonner';

// Helper to format date for input type="date"
const toInputDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function EditRotationModal({ rotation, onClose }) {
    const { updateRotation } = useStore();
    const [inicio, setInicio] = useState(toInputDate(rotation.Inicio));
    const [final, setFinal] = useState(toInputDate(rotation.Final));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateRotation(rotation.Id_Rotacion, {
                Inicio: inicio,
                Final: final,
            });
            toast.success("Rotación actualizada exitosamente");
            onClose();
        } catch (error) {
            console.error("Error updating rotation:", error);
            toast.error("No se pudo actualizar la rotación.");
        }
    };

    // Cierra el modal si se presiona la tecla Escape
    useEffect(() => {
        const handleEsc = (event) => {
           if (event.keyCode === 27) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg animate-fade-in-down" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Rotación</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de Inicio *</label>
                        <input type="date" value={inicio} onChange={e => setInicio(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de Fin *</label>
                        <input type="date" value={final} onChange={e => setFinal(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border" required />
                    </div>
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
}