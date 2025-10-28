import { useState } from "react";
import { useStore } from "../context/StoreProvider";

export default function MaterialForm() {
  const { addMaterial } = useStore();
  const [name, setName] = useState("");
  const [qty, setQty]   = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    addMaterial(name, qty);
    setName(""); setQty("");
    alert("Material registrado exitosamente");
  };

  return (
    <div className="bg-white shadow-custom rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Registro de Material</h3>
        <p className="mt-1 text-sm text-gray-500">Agregar nuevo material al inventario</p>
      </div>
      <div className="px-6 py-4">
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Material *</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad Inicial *</label>
            <input type="number" min="0" value={qty} onChange={e=>setQty(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border" required />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full inline-flex justify-center py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Registrar Material
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}