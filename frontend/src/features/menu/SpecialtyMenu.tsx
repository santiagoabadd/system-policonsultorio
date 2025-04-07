import { useState } from "react"
import { useNavigate } from 'react-router-dom';
export const SpecialtyMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState("Seleccione una especialidad")

  let navigate = useNavigate();

  const specialties = [
    "Cardiología",
    "Dermatología",
    "Endocrinología",
    "Gastroenterología",
    "Hematología",
    "Inmunología",
    "Traumatología",
    "Neurología",
    "Obstetricia y Ginecología",
    "Oncología",
    "Oftalmología",
    "Ortopedia",
    "Otorrinolaringología",
    "Pediatría",
    "Psiquiatría",
    "Neumología",
    "Radiología",
    "Reumatología",
    "Urología",
  ]

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const selectSpecialty = (specialty: string) => {
    setSelectedSpecialty(specialty)
    setIsOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-teal-700 mb-6 text-center">Seleccione una especialidad</h1>

        <div className="relative">
          <button
            onClick={toggleMenu}
            className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <span className={selectedSpecialty === "Select a specialty" ? "text-gray-500" : "text-gray-900"}>
              {selectedSpecialty}
            </span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <ul className="py-1">
                {specialties.map((specialty) => (
                  <li key={specialty}>
                    <button
                      onClick={() => selectSpecialty(specialty)}
                      className="w-full text-left px-4 py-2 hover:bg-teal-50 focus:bg-teal-50 focus:outline-none"
                    >
                      {specialty}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {selectedSpecialty !== "Select a specialty" && (
          <div className="mt-8 flex justify-center">
            <button
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors shadow-sm"
              onClick={() => navigate(`/turno/${selectedSpecialty}`) }
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};