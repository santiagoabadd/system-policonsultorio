import type React from "react"

import { useState, useEffect } from "react"
import { format, addDays, subDays, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { callApi } from "../../helpers/axios_helper"
import { useAuth } from "../../auth/AuthContext"

import {
    Calendar,
    Clock,
    User,
    ChevronLeft,
    ChevronRight,
    Building,
    CalendarIcon,
    CheckCircle,
    XCircle,
    AlertCircle,
    ClockIcon,
} from "lucide-react"

interface Clinic {
    id: number
    name: string
    address?: string
}

interface Patient {
    id: number
    name: string
    phone?: string
    dni: string
}

interface TimeSlot {
    time: string
    appointment: Appointment | null
}

interface Appointment {
    id: number
    date: string
    state: string
    patient: Patient
    notes?: string
}

interface Medic {
    id: number
    name: string
    specialty: string
}

export const ScheduleClinic: React.FC = () => {
    const { user } = useAuth()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [clinic, setClinic] = useState<Clinic | null>(null)
    const [medics, setMedics] = useState<Medic[]>([])
    const [selectedMedic, setSelectedMedic] = useState<number | "all">("all")
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [isLoadingMedic, setIsLoadingMedic] = useState(true)
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
    const [isLoadingClinics, setIsLoadingClinics] = useState(true)
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [stats, setStats] = useState({
        total: 0,
        absentWithNotice: 0,
        absent: 0,
        attended: 0,
        waiting: 0,
        pending: 0
    })


    useEffect(() => {
        const fetchClinicInfo = async () => {
            if (!user?.id) return

            setIsLoadingMedic(true)
            try {
                const response = await callApi(`/api/policonsultorio/clinic/authUserId/${user.id}`, "GET")
                if (response && response.data) {
                    setClinic(response.data)
                }
            } catch (error) {
                console.error("Error fetching clinic info:", error)
                setError("No se pudo obtener la información de la clinica")
            } finally {
                setIsLoadingMedic(false)
            }
        }

        fetchClinicInfo()
    }, [user])


    useEffect(() => {
        const fetchMedics = async () => {
            if (!clinic?.id) return
            console.log(selectedDate.toLocaleDateString('es-ES', { weekday: 'long' }))
            setIsLoadingClinics(true)
            try {
                console.log(selectedDate.toLocaleDateString('es-ES', { weekday: 'long' }))
                const response = await callApi(`/api/policonsultorio/medic/${clinic.id}/medics`, "GET", undefined, {
                    dayOfWeek: selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase() || undefined
                  
                  })
                if (response && response.data) {
                    setMedics(response.data)
                }
            } catch (error) {
                console.error("Error fetching medics :", error)
                setError("No se pudieron cargar lis medicos")
            } finally {
                setIsLoadingClinics(false)
            }
        }

        fetchMedics()
    }, [selectedDate,clinic])


    useEffect(() => {
        const fetchAppointments = async () => {
            if (!clinic?.id || selectedMedic === "all") {
                setIsLoadingAppointments(false)
                setAppointments([])
                setTimeSlots(generateTimeSlots())
                setStats({
                    total: 0,
                    absent: 0,
                    attended: 0,
                    waiting: 0,
                    absentWithNotice: 0,
                    pending: 0
                })
                return
            }
            
            setIsLoadingAppointments(true)
            try {
                const formattedDate = format(selectedDate, "yyyy-MM-dd")
                let endpoint = `/api/policonsultorio/appointment/medic/${selectedMedic}/date/${formattedDate}/clinic/${clinic.id}`

                const response = await callApi(endpoint, "GET")

                if (response && response.data) {
                    setAppointments(response.data)
                    console.log("asgasgddsgsdg")
                    console.log(response.data)

                    const total = response.data.length
                    const waiting = response.data.filter((app: Appointment) => app.state.toLowerCase() === "esperando").length
                    const absent = response.data.filter((app: Appointment) => app.state.toLowerCase() === "ausente").length
                    const attended = response.data.filter((app: Appointment) => app.state.toLowerCase() === "atendido").length
                    const absentWithNotice = response.data.filter((app: Appointment) => app.state.toLowerCase() === "ausente con aviso").length
                    const pending = response.data.filter((app: Appointment) => app.state.toLowerCase() === "pendiente").length

                    setStats({
                        total,
                        absent,
                        waiting,
                        attended,
                        absentWithNotice,
                        pending
                    })
                    const slots = generateTimeSlots()
                    response.data.forEach((appointment: Appointment) => {
                        const timeString = appointment.date.substring(11, 16)
                        console.log("apointment date " + timeString)
                        console.log("apointment date " + slots.at(1)?.time)
                        const slotIndex = slots.findIndex((slot) => slot.time === timeString)
                        if (slotIndex !== -1) {
                            slots[slotIndex].appointment = appointment
                        }
                    })
                    setTimeSlots(slots)
                } else {
                    setAppointments([])
                    setTimeSlots(generateTimeSlots())
                    setStats({
                        total: 0,
                        absent: 0,
                        attended: 0,
                        waiting: 0,
                        absentWithNotice: 0,
                        pending: 0
                    })
                }
            } catch (error) {
                console.error("Error fetching appointments:", error)
                setError("No se pudieron cargar los turnos para la fecha seleccionada")
                setAppointments([])
                setTimeSlots(generateTimeSlots())
            } finally {
                setIsLoadingAppointments(false)
            }
        }


        fetchAppointments()
    }, [medics, selectedDate, selectedMedic])

    const generateTimeSlots = () => {
        const slots: TimeSlot[] = []
        const startHour = 8
        const endHour = 19
        const endMinute = 30

        for (let hour = startHour; hour <= endHour; hour++) {
            for (const minute of [0, 30]) {
                if (hour === endHour && minute > endMinute) continue

                const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
                slots.push({
                    time: timeString,
                    appointment: null,
                })
            }
        }

        return slots
    }

    const nextDay = () => {
        setSelectedDate(addDays(selectedDate, 1))
    }

    const prevDay = () => {
        setSelectedDate(subDays(selectedDate, 1))
    }

    const goToToday = () => {
        setSelectedDate(new Date())
    }

    const handleMedicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        setSelectedMedic(value === "all" ? "all" : Number(value))
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value)
        setSelectedDate(date)
    }

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

    
    const isToday = isSameDay(selectedDate, new Date())

    return (
        <div className="container mx-auto py-6 px-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg border shadow-sm mb-6">
                        
                    </div>

                    <div className="bg-white rounded-lg border shadow-sm mb-6">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Resumen del Día</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total de turnos:</span>
                                    <span className="font-medium">{stats.total}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center text-gray-600">
                                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                                        Atendido:
                                    </span>
                                    <span className="font-medium">{stats.attended}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center text-gray-600">
                                        <ClockIcon className="h-4 w-4 text-blue-600 mr-1" />
                                        Esperando:
                                    </span>
                                    <span className="font-medium">{stats.waiting}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center text-gray-600">
                                        <ClockIcon className="h-4 w-4 text-grey-600 mr-1" />
                                        Pendiente:
                                    </span>
                                    <span className="font-medium">{stats.pending}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center text-gray-600">
                                        <XCircle className="h-4 w-4 text-yellow-600 mr-1" />
                                        Ausente con aviso:
                                    </span>
                                    <span className="font-medium">{stats.absent}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center text-gray-600">
                                        <XCircle className="h-4 w-4 text-red-600 mr-1" />
                                        Ausente:
                                    </span>
                                    <span className="font-medium">{stats.absentWithNotice}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border shadow-sm">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Medicos del Día</h2>
                            {isLoadingClinics ? (
                                <div className="animate-pulse space-y-3">
                                    <div className="h-5 bg-gray-200 rounded"></div>
                                    <div className="h-5 bg-gray-200 rounded"></div>
                                </div>
                            ) : medics.length > 0 ? (
                                <ul className="space-y-2">
                                    {medics.map((medic) => (
                                        <li key={medic.id} className="flex items-start">
                                            <Building className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                                            <div>
                                                <p className="font-medium">{medic.name}</p>
                                                
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No hay clínicas asociadas</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg border shadow-sm mb-6">
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                                <div className="flex items-center">
                                    <button onClick={prevDay} className="p-2 rounded-md hover:bg-gray-100" aria-label="Día anterior">
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <div className="mx-2">
                                        <h2 className="text-xl font-semibold">
                                            {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                                            {isToday && (
                                                <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Hoy</span>
                                            )}
                                        </h2>
                                    </div>
                                    <button onClick={nextDay} className="p-2 rounded-md hover:bg-gray-100" aria-label="Día siguiente">
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                    <button
                                        onClick={goToToday}
                                        className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
                                    >
                                        <CalendarIcon className="h-4 w-4 mr-1" />
                                        Hoy
                                    </button>
                                    <input
                                        type="date"
                                        value={format(selectedDate, "yyyy-MM-dd")}
                                        onChange={handleDateChange}
                                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="clinic" className="block text-sm font-medium text-gray-700 mb-1">
                                    Filtrar por Medico
                                </label>
                                <select
                                    id="clinic"
                                    name="clinic"
                                    value={selectedMedic === "all" ? "all" : selectedMedic.toString()}
                                    onChange={handleMedicChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="all">Seleccione un medico para cargar su agenda</option>
                                    {medics.map((medic) => (
                                        <option key={medic.id} value={medic.id.toString()}>
                                            {medic.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <h3 className="text-lg font-medium mb-4">Agenda del Día</h3>

                            {isLoadingAppointments ? (
                                <div className="animate-pulse">
                                    <div className="h-10 bg-gray-200 rounded mb-2"></div>
                                    <div className="space-y-2">
                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                            <div key={i} className="h-12 bg-gray-200 rounded"></div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                                                >
                                                    Hora
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Paciente
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Doc / H.C.
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Tel./F.N.
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    O.S. / N.A.
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Estado
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {timeSlots.map((slot, index) => (
                                                <tr key={index} className={slot.appointment ? "bg-blue-50" : ""}>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-100">
                                                        {slot.time}
                                                    </td>

                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {slot.appointment ? (
                                                            <div className="flex items-center">
                                                                <span className="font-medium">{slot.appointment.patient.name}</span>

                                                            </div>
                                                        ) : null}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {slot.appointment?.patient.dni || ""}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {slot.appointment?.patient.phone || ""}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {slot.appointment && (
                                                            <span> N.A</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {slot.appointment?.state && (
                                                            <span
                                                                className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                                                                    slot.appointment.state,
                                                                )}`}
                                                            >
                                                                {slot.appointment.state}
                                                            </span>
                                                        )}
                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
