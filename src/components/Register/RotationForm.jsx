// src/components/Register/RotationForm.jsx
import { useState } from "react";
import { useStore } from "../../context/StoreProvider";
import { toast } from 'sonner';

export default function RotationForm() {
    const { addRotation } = useStore();
    const [inicio, setInicio] = useState("");
    const [final, setFinal] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await addRotation({
                Inicio: inicio,
                Final: final,
            });
            setInicio("");
            setFinal("");
            toast.success("Rotación registrada exitosamente");
        } catch (err) {
            toast.error(err.message || "Error al registrar la rotación");
        }
    };

    return (
        <div className="bg-white shadow-custom rounded-lg mt-6">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Registro de Rotación</h3>
                <p className="mt-1 text-sm text-gray-500">Agregar una nueva rotación al sistema</p>
            </div>
            <div className="px-6 py-4">
                <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de Inicio *</label>
                        <input type="date" value={inicio} onChange={e => setInicio(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de Fin *</label>
                        <input type="date" value={final} onChange={e => setFinal(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border" required />
                    </div>
                    <div className="sm:col-span-3 flex items-end">
                        <button type="submit" className="w-full inline-flex justify-center py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700">
                            Registrar Rotación
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}