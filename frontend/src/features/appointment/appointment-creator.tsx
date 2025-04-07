import type React from "react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface AppointmentCreatorProps {
  doctorId: string
  doctorName: string
  selectedDate: string
  availableSlots: string[]
  onCreateAppointment: (slot: string) => void
}



export const AppointmentCreator: React.FC<AppointmentCreatorProps> = ({ doctorId,
  doctorName,
  selectedDate,
  availableSlots,
  onCreateAppointment, }) => {

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)



  useEffect(() => {
    setSelectedSlot(null)
  }, [availableSlots])


  const formattedDate = selectedDate ? format(new Date(selectedDate), "EEEE d 'de' MMMM 'de' yyyy", { locale: es }) : ""


  const groupedSlots: Record<string, string[]> = {}
  availableSlots.forEach((slot) => {
    const hour = slot.substring(11, 13)
    if (!groupedSlots[hour]) {
      groupedSlots[hour] = []
    }
    groupedSlots[hour].push(slot)
  })



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSlot) {
      onCreateAppointment(selectedSlot)

      setSelectedSlot(null)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">Crear nuevo turno</h2>
        <p className="mt-2 text-gray-600">
          Dr. {doctorName} - {formattedDate}
        </p>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Horarios disponibles</h3>

        {Object.keys(groupedSlots).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(groupedSlots).map(([hour, slots]) => (
              <div key={hour} className="border-b border-gray-100 pb-4 last:border-0">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  {hour}:00 - {hour}:59
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {slots.map((slot) => {
                    const timeStr = slot.substring(11, 16)
                    const isSelected = selectedSlot === slot

                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`
                          py-2 px-4 rounded-md text-sm font-medium transition-colors
                          ${isSelected ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
                        `}
                      >
                        {timeStr}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay horarios disponibles para esta fecha.</p>
        )}

        {selectedSlot && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="pt-4">
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white font-medium rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Confirmar turno para las {selectedSlot.substring(11, 16)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
