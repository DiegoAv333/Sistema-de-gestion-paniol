import { useState, useMemo } from "react";
import { useStore } from "../../context/StoreProvider";

export default function StockMovementModal({ material, onClose }) {
  const { materials, teachers, registerMovement, talleres } = useStore();
  const [materialId, setMaterialId] = useState(material?.Id_Material ?? "");
  const [movementType, setMovementType] = useState("Ingreso");
  const [quantity, setQuantity] = useState(1);
  const [department, setDepartment] = useState("");
  const [responsible, setResponsible] = useState("");
  const [observations, setObservations] = useState("");
  const [showTeacherList, setShowTeacherList] = useState(false);
  
  const onSubmit = (e) => {
    e.preventDefault();
    const movementData = {
      materialId: Number(materialId),
      movementType,
      quantity,
      observations,
    };

    if (movementType === "Egreso") {
      movementData.department = department;
      movementData.responsible = responsible;
    }

    registerMovement(movementData);
    onClose();
  };

  const filteredTeachers = useMemo(() => {
    if (!department) return teachers;
    const selectedTaller = talleres.find((t) => t.Denominacion === department);
    if (!selectedTaller) return [];
    return teachers.filter((t) => t.Id_Taller === selectedTaller.Id_Taller);
  }, [department, teachers, talleres]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Registrar Movimiento
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Material *
            </label>
            <select
              value={materialId}
              onChange={(e) => setMaterialId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Seleccionar…</option>
              {materials.map((m) => (
                <option key={m.Id_Material} value={m.Id_Material}>
                  {m.Nombre_Descripcion}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="movementType"
                  value="Ingreso"
                  checked={movementType === "Ingreso"}
                  onChange={() => setMovementType("Ingreso")}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Ingreso</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="movementType"
                  value="Egreso"
                  checked={movementType === "Egreso"}
                  onChange={() => setMovementType("Egreso")}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Egreso</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad *
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          {movementType === "Egreso" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Seleccionar…</option>
                  {talleres.map((t) => (
                    <option key={t.Id_Taller} value={t.Denominacion}>
                      {t.Denominacion}
                    </option>
                  ))}
                </select>
              </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Responsable *
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={responsible}
                                  onChange={(e) => setResponsible(e.target.value)}
                                  onFocus={() => setShowTeacherList(true)}
                                  onBlur={() => setTimeout(() => setShowTeacherList(false), 200)}
                                  className="w-full px-3 py-2 border rounded-md"
                                  placeholder="Buscar docente..."
                                  required
                                  autoComplete="off"
                                />
                                {showTeacherList && (
                                  <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                                    {filteredTeachers.length > 0 ? (
                                      filteredTeachers
                                        .filter(t => `${t.Nombre} ${t.Apellido}`.toLowerCase().includes(responsible.toLowerCase()))
                                        .map(t => (
                                          <li
                                            key={t.Id_Docente}
                                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                            onMouseDown={() => { // onMouseDown se dispara antes que onBlur
                                              setResponsible(`${t.Nombre} ${t.Apellido}`);
                                              setShowTeacherList(false);
                                            }}
                                          >
                                            {`${t.Nombre} ${t.Apellido}`}
                                          </li>
                                        ))
                                    ) : (
                                      <li className="px-3 py-2 text-gray-500">No hay docentes para este departamento.</li>
                                    )}
                                  </ul>
                                )}
                              </div>
                            </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              rows={3}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border rounded-md py-2 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md py-2 text-white bg-blue-600 hover:bg-blue-700"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
