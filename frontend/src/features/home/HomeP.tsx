import { Calendar, Users, User, Home, PlusCircle, Activity } from "lucide-react"
import { useEffect } from "react"


import { useAuth } from "../../auth/AuthContext";

export const HomeP: React.FC = () => {

  useEffect(() => {
    console.log(user?.role)
  }, [])

  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5 flex items-start">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Pacientes</h3>
                  <p className="text-sm text-gray-500 mt-1">Administrar pacientes</p>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <a href="/pacientes" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Ver pacientes
                  </a>
                  <div className="flex flex-row items-center">
                  <PlusCircle className="h-4 w-4 mr-1" />
                    <a
                      href="/paciente/form"
                      className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
                    >
                      
                      Añadir Paciente
                    </a>
                    
                  </div>
                  
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5 flex items-start">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Turnos</h3>
                  <p className="text-sm text-gray-500 mt-1">Agendar y administrar turnos</p>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <a href="/menuEspecialidad" className="text-sm font-medium text-green-600 hover:text-green-500">
                  Agendar un turno
                </a>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5 flex items-start">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Medicos</h3>
                  <p className="text-sm text-gray-500 mt-1">Buscar medicos</p>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <a href="/medicos" className="text-sm font-medium text-purple-600 hover:text-purple-500">
                    Ver medicos de {user?.userName}
                  </a>
                  <div className="flex flex-row items-center">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  <a
                    href="/medic/form"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
                  >
                   
                    Registrar medico
                  </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Quick Access</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              <li>
                <a href="/" className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6 flex items-center">
                    <Home className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Home</p>
                      <p className="text-sm text-gray-500">Return to home page</p>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a href="/pacientes" className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6 flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Patient List</p>
                      <p className="text-sm text-gray-500">View and manage all patients</p>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a href="/paciente/form" className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6 flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">New Patient</p>
                      <p className="text-sm text-gray-500">Register a new patient</p>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a href="/menuEspecialidad" className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6 flex items-center">
                    <Activity className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Specialties</p>
                      <p className="text-sm text-gray-500">Browse medical specialties</p>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-gray-500 text-center">© 2023 Medical Clinic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

