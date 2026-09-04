import { useState, useEffect } from "react";
import { useStore } from "../../context/StoreProvider";
import { toast } from 'sonner';

export default function EditTallerModal({ taller, onClose }) {
    const { updateTaller } = useStore();
    const [denominacion, setDenominacion] = useState(taller.Denominacion);
    const [turno, setTurno] = useState(taller.Turno);
    const [anio, setAnio] = useState(taller.anio || "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateTaller(taller.Id_Taller, {
                Denominacion: denominacion,
                Turno: turno,
                anio: anio || null
            });
            toast.success("Taller actualizado exitosamente");
            onClose();
        } catch (error) {
            toast.error(error.message || "No se pudo actualizar el taller.");
        }
    };

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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Taller</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre del Taller *</label>
                        <input value={denominacion} onChange={e => setDenominacion(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Turno *</label>
                        <select value={turno} onChange={e => setTurno(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border" required>
                            <option value='Maniana'>Mañana</option>
                            <option value='Tarde'>Tarde</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Año del Curso</label>
                        <input
                            type="number"
                            min="1"
                            max="6"
                            value={anio}
                            onChange={e => setAnio(e.target.value)}
                            placeholder="Ej: 4"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border"
                        />
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