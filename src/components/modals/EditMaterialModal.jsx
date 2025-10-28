import { useState } from "react";
import { useStore } from "../../context/StoreProvider";

export default function EditMaterialModal({ material, onClose }) {
    const { updateMaterial } = useStore();
    const [name, setName] = useState(material.name);
    const [quantity, setQuantity] = useState(material.quantity);

    const onSubmit = (e) => {
        e.preventDefault();
        updateMaterial(material.id, { name, quantity: Number(quantity) });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Editar Material</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
                <input type="number" min="0" value={quantity} onChange={e=>setQuantity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div className="flex space-x-3 pt-4">
                <button type="button" onClick={onClose} className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="flex-1 inline-flex justify-center py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700">Actualizar</button>
            </div>
            </form>
        </div>
        </div>
    );
}
