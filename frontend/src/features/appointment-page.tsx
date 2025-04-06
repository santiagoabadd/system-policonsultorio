import { useState, useEffect } from "react"
import AppointmentCreator from "./appointment-creator"


interface MedicoInfo {
    id:string
    nombre: string
    especialidad: string

  }

export default function AppointmentPage() {
  const [medicoId, setMedicoId] = useState<string>("1")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [medicos, setMedicos] = useState<MedicoInfo[]>([])
  const token = localStorage.getItem('token');
  // Fetch doctors from API
  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:8080/api/policonsultorio/medico/all", {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
  
        if (response.ok) {
          const data = await response.json(); // ← Parseás el JSON
          setMedicos(data); // ← Lo seteás en tu estado
        } else {
          console.error("Error en la respuesta:", response.status);
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
  
    fetchMedicos();
  }, []);

  // Function to fetch available slots
  const fetchAvailableSlots = async () => {
    setLoading(true)
    setError(null)

    const payload = {
        date: "2025-12-15",
        medicoId: 1
      }

    try {
      // Format the date for the API request (YYYY-MM-DD)
      const formattedDate = selectedDate.split("T")[0]

      // Make the API call to get available slots
      const response = await fetch(
        `http://localhost:8080/api/policonsultorio/turno/available`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
        })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setAvailableSlots(data)
    } catch (err) {
      setError("Error al cargar los horarios disponibles. Por favor, intente nuevamente.")
      console.error("Error fetching available slots:", err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    fetchAvailableSlots()
  }, [medicoId, selectedDate])

  // Handle appointment creation
  const handleCreateAppointment = async (slot: string) => {
    setLoading(true)

    try {
      // Prepare the payload according to the API requirements
      const payload = {
        estado: "PENDIENTE",
        fecha: slot,
        clinicaId: 1, 
        medicoId: Number.parseInt(medicoId),
        pacienteId: 1,
      }

      // Make the API call
      const response = await fetch("http://localhost:8080/api/policonsultorio/turno/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Turno creado:", data)

      // Show success message
      alert(`Turno creado exitosamente para ${new Date(slot).toLocaleTimeString()}`)

      // Refresh available slots after creating an appointment
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
              value={medicoId}
              onChange={(e) => setMedicoId(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              {medicos.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.nombre}
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
          doctorId={medicoId}
          doctorName={medicos.find((d) => d.id === medicoId)?.nombre || ""}
          selectedDate={selectedDate}
          availableSlots={availableSlots}
          onCreateAppointment={handleCreateAppointment}
        />
      )}
    </div>
  )
}

