import { useState, useEffect } from "react"
import {AppointmentCreator} from "./appointment-creator"
import {callApi} from "../../helpers/axios_helper"

interface SpecialtyProps {
  specialty: string

}


interface MedicoInfo {
    id:string
    name: string
    specialty: string

  }

export const AppointmentPage: React.FC<SpecialtyProps> = ({specialty}) => {
  const [medicId, setMedicId] = useState<string>("1")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [medicos, setMedicos] = useState<MedicoInfo[]>([])



  useEffect(() => {
    const fetchMedics = async () => {
      try {
        const response = await callApi(`/api/policonsultorio/medic/specialty/${specialty}`)
        if (response) {
          setMedicos(response.data);
        } else {
          console.error("Error en la respuesta");
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
  
    fetchMedics();
  }, []);


  const fetchAvailableSlots = async () => {
    setLoading(true)
    setError(null)

    const payload = {
      date:selectedDate,
      medicId: medicId
    }

    try {
  
      const response = await callApi(
        `/api/policonsultorio/appointment/available`,'POST',payload)

      if (!response) {
        throw new Error("Error")
      }

      setAvailableSlots(response.data)
    } catch (err) {
      setError("Error al cargar los horarios disponibles. Por favor, intente nuevamente.")
      console.error("Error fetching available slots:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAvailableSlots()
  }, [medicId, selectedDate])

  const handleCreateAppointment = async (slot: string) => {
    setLoading(true)

    try {
      const payload = {
        state: "PENDIENTE",
        date: slot,
        clinicId: 1, 
        medicId: Number.parseInt(medicId),
        patientId: 1,
      }

      const response = await callApi("/api/policonsultorio/appointment/create","POST",payload)

      if (!response) {
        throw new Error(`Error: `)
      }

      console.log("Turno creado:", response.data)

      alert(`Turno creado exitosamente para ${new Date(slot).toLocaleTimeString()}`)

      fetchAvailableSlots()
    } catch (err) {
      console.error("Error al crear el turno:", err)
      alert("Error al crear el turno. Por favor, intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Reservar un turno</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar médico
            </label>
            <select
              id="doctor"
              value={medicId}
              onChange={(e) => setMedicId(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              {medicos.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar fecha
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
      ) : (
        <AppointmentCreator
          doctorId={medicId}
          doctorName={medicos.find((d) => d.id === medicId)?.name || ""}
          selectedDate={selectedDate}
          availableSlots={availableSlots}
          onCreateAppointment={handleCreateAppointment}
        />
      )}
    </div>
  );
};

