import type React from "react"

import { useState, useEffect } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { es } from "date-fns/locale"
import { callApi } from "../../helpers/axios_helper"
import { useAuth } from "../../auth/AuthContext"
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from "lucide-react"

interface DoctorSchedule {
  id: number
  dayOfWeek: string
  startTime: string
  endTime: string
  active: boolean
}

interface Patient {
  id: number
  name: string
}

interface Appointment {
  id: number
  date: string
  time: string
  status: string
  patient: Patient
}

export const DoctorCalendar: React.FC = () => {
  const { user } = useAuth()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [doctorId, setDoctorId] = useState<number | null>(null)
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(true)
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Map day of week string to number (0 = Sunday, 1 = Monday, etc.)
  const dayOfWeekMap: Record<string, number> = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  }

  // Fetch doctor ID based on authenticated user
  useEffect(() => {
    const fetchDoctorId = async () => {
      if (!user?.id) return

      try {
        const response = await callApi(`/api/policonsultorio/doctor/user/${user.id}`, "GET")
        if (response && response.data) {
          setDoctorId(response.data.id)
        }
      } catch (error) {
        console.error("Error fetching doctor ID:", error)
        setError("No se pudo obtener la información del médico")
      }
    }

    fetchDoctorId()
  }, [user])

  useEffect(() => {
    const fetchDoctorSchedules = async () => {
      if (!doctorId) return

      setIsLoadingSchedules(true)
      try {
        const response = await callApi(`/api/policonsultorio/doctor/${doctorId}/schedules`, "GET")
        if (response && response.data) {
          setSchedules(response.data)
        }
      } catch (error) {
        console.error("Error fetching doctor schedules:", error)
        setError("No se pudieron cargar los horarios del médico")
      } finally {
        setIsLoadingSchedules(false)
      }
    }

    fetchDoctorSchedules()
  }, [doctorId])

  // Fetch appointments for selected date
  useEffect(() => {
    const fetchAppointmentsForDate = async () => {
      if (!doctorId || !selectedDate) return

      setIsLoadingAppointments(true)
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd")
        const response = await callApi(
          `/api/policonsultorio/appointments/doctor/${doctorId}/date/${formattedDate}`,
          "GET",
        )
        if (response && response.data) {
          setAppointments(response.data)
        } else {
          setAppointments([])
        }
      } catch (error) {
        console.error("Error fetching appointments:", error)
        setError("No se pudieron cargar los turnos para la fecha seleccionada")
        setAppointments([])
      } finally {
        setIsLoadingAppointments(false)
      }
    }

    fetchAppointmentsForDate()
  }, [doctorId, selectedDate])

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const onDateClick = (day: Date) => {
    setSelectedDate(day)
  }

  // Check if a day has a schedule
  const hasDoctorSchedule = (date: Date) => {
    const dayOfWeek = format(date, "EEEE").toUpperCase()
    return schedules.some((schedule) => schedule.active && dayOfWeekMap[schedule.dayOfWeek] === date.getDay())
  }

  // Format time from "HH:MM:SS" to "HH:MM AM/PM"
  const formatTime = (timeString: string) => {
    if (!timeString) return ""

    const timeParts = timeString.split(":")
    if (timeParts.length < 2) return timeString

    const hours = Number.parseInt(timeParts[0], 10)
    const minutes = timeParts[1]
    const ampm = hours >= 12 ? "PM" : "AM"
    const hour12 = hours % 12 || 12

    return `${hour12}:${minutes} ${ampm}`
  }

  // Get status color for appointment
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Render days of the month
  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

    return (
      <div className="calendar">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center font-medium text-sm py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((day, i) => {
            const hasSchedule = hasDoctorSchedule(day)
            const isSelected = selectedDate && isSameDay(day, selectedDate)

            return (
              <div
                key={i}
                className={`
                  p-2 text-center rounded-md cursor-pointer transition-colors
                  ${!isSameMonth(day, currentMonth) ? "text-gray-300" : ""}
                  ${hasSchedule ? "bg-green-50 hover:bg-green-100" : "hover:bg-gray-100"}
                  ${isSelected ? "bg-green-200 hover:bg-green-200 font-bold" : ""}
                `}
                onClick={() => onDateClick(day)}
              >
                <span className="text-sm">{format(day, "d")}</span>
                {hasSchedule && <div className="w-1.5 h-1.5 bg-green-500 rounded-full mx-auto mt-1"></div>}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Render appointments for selected date
  const renderAppointments = () => {
    if (!selectedDate) {
      return <div className="text-center py-8 text-gray-500">Selecciona un día para ver los turnos</div>
    }

    if (isLoadingAppointments) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )
    }

    if (appointments.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No hay turnos para el día {format(selectedDate, "d 'de' MMMM", { locale: es })}
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="border rounded-md p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="font-medium">{formatTime(appointment.time)}</span>
                </div>
                <div className="flex items-center mt-1">
                  <User className="h-4 w-4 text-gray-500 mr-1" />
                  <span>{appointment.patient.name}</span>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
            
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Mi Calendario</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">{format(currentMonth, "MMMM yyyy", { locale: es })}</h2>
                <div className="flex space-x-2">
                  <button onClick={prevMonth} className="p-2 rounded-md hover:bg-gray-100" aria-label="Mes anterior">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={nextMonth} className="p-2 rounded-md hover:bg-gray-100" aria-label="Mes siguiente">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {isLoadingSchedules ? (
                <div className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              ) : (
                renderDays()
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                <h2 className="text-xl font-semibold">
                  {selectedDate ? format(selectedDate, "d 'de' MMMM", { locale: es }) : "Turnos del día"}
                </h2>
              </div>
              {renderAppointments()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
