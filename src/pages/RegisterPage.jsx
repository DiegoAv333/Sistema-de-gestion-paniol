import { useState } from "react";
import MaterialForm from "../components/MaterialForm";
import TeacherForm from "../components/Register/TeacherForm";
import TeachersTable from "../components/Register/TeachersTable";

export default function RegisterPage() {
  const [sub, setSub] = useState("material");
  const base="border-b-2 py-4 px-1 text-sm font-medium";
  const active="border-blue-500 text-blue-600"; const inactive="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";

  return (
    <div className="fade-in">
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button onClick={()=>setSub("material")} className={`${base} ${sub==='material'?active:inactive}`}>Registrar Material</button>
          <button onClick={()=>setSub("teacher")}  className={`${base} ${sub==='teacher'?active:inactive}`}>Registrar Profesor</button>
        </div>
      </div>

      {sub==='material' && <MaterialForm />}
      {sub==='teacher'  && <> 
        <TeacherForm />
        <div className="mt-6"><TeachersTable /></div>
      </>} 
    </div>
  );
}