export default function Header({ user, dateStr }) {
  return (
    <header className="bg-white shadow-custom">
      <div className="py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bienvenido, {user}</h1>
            <p className="text-sm text-gray-500">{dateStr}</p>
          </div>
        </div>
      </div>
    </header>
  );
}