    // src/components/Modals/DeleteTeacherModal.jsx
    export default function DeleteTeacherModal({ teacher, onCancel, onConfirm }) {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Eliminar Profesor</h3>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            </div>
            <p className="text-sm text-gray-700 mb-6">
            ¿Eliminar al profesor <strong>{teacher.name} {teacher.lastName}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex space-x-3">
            <button onClick={onCancel} className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50">Cancelar</button>
            <button onClick={onConfirm} className="flex-1 inline-flex justify-center py-2 px-4 rounded-md text-white bg-red-600 hover:bg-red-700">Eliminar</button>
            </div>
        </div>
        </div>
    );
    }
