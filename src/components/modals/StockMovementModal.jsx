
import { useState } from "react";
import { useStore } from "../../context/StoreProvider";

export default function StockMovementModal({ material, onClose }) {
  const { materials, teachers, registerMovement } = useStore();
  const [materialId, setMaterialId] = useState(material?.id ?? "");
  const [movementType, setMovementType] = useState("Ingreso");
  const [quantity, setQuantity] = useState(1);
  const [department, setDepartment] = useState("");
  const [responsible, setResponsible] = useState("");
  const [observations, setObservations] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    registerMovement({ materialId, movementType, quantity, responsible, observations, department });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Registrar Movimiento</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material *</label>
            <select value={materialId} onChange={e=>setMaterialId(e.target.value)} className="w-full px-3 py-2 border rounded-md" required>
              <option value="">Seleccionar…</option>
              {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
            <select value={movementType} onChange={e=>setMovementType(e.target.value)} className="w-full px-3 py-2 border rounded-md">
              <option>Ingreso</option>
              <option>Egreso</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
            <input type="number" min="1" value={quantity} onChange={e=>setQuantity(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
            <select value={department} onChange={e=>setDepartment(e.target.value)} className="w-full px-3 py-2 border rounded-md">
              <option value="">Todos</option>
              {["Construcción","Carpintería","Electricidad","Mecánica","Administración","Informática","Soldadura","Plomería"].map(d=>(
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsable *</label>
            <input value={responsible} onChange={e=>setResponsible(e.target.value)} list="responsables" className="w-full px-3 py-2 border rounded-md" required />
            <datalist id="responsables">
              {teachers.map(t => <option key={t.id} value={t.name} />)}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <textarea rows={3} value={observations} onChange={e=>setObservations(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="flex space-x-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border rounded-md py-2 bg-white hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="flex-1 rounded-md py-2 text-white bg-blue-600 hover:bg-blue-700">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}