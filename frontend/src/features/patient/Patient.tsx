import { useState, useEffect } from "react"
import { format } from "date-fns"
import { useNavigate } from 'react-router-dom';
import { callApi } from "../../helpers/axios_helper"

interface MedicResponse {
    id: number
    name: string
    speciality?: string
}

interface ClinicResponse {
    id: number
    name: string
    address?: string
}

interface AppointmentResponse {
    id: number
    state: string
    date: string
    medic: MedicResponse
    clinic: ClinicResponse
}

interface Patient {
    id: number
    name: string
    phone: string
    address: string
    dni: string
    appointments: AppointmentResponse[]
}

interface PatientProps {
    id: string
}

export const Patient: React.FC<PatientProps> = (id) => {

    let navigate = useNavigate()


    const [patient, setPatient] = useState<Patient | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPatientData = async () => {
            setIsLoading(true)
            try {
                const response = await callApi(`/api/policonsultorio/patient/${id.id}`)

                if (!response) {
                    throw new Error("Failed to fetch patient data")
                }

                setPatient(response.data)
            } catch (error) {
                console.error("Error fetching patient:", error)
                setError("Failed to load patient information")
            } finally {
                setIsLoading(false)
            }
        }

        if (id) {
            fetchPatientData()
        }
    }, [id])

    const handleBack = () => {
        navigate(-1);
    }

    const getStatusColor = (state: string) => {
        switch (state.toLowerCase()) {
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

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 px-4">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="h-40 bg-gray-200 rounded mb-6"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto py-10 px-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
                <button onClick={handleBack} className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md">
                    Back to Patients
                </button>
            </div>
        )
    }

    if (!patient) {
        return (
            <div className="container mx-auto py-10 px-4">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">Patient not found</span>
                </div>
                <button onClick={handleBack} className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md">
                    Back to Patients
                </button>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex items-center mb-6">
                <button onClick={handleBack} className="mr-4 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md">
                    ← Back
                </button>
                <h1 className="text-3xl font-bold">Patient Details</h1>
            </div>
            <div className="bg-white rounded-lg border shadow-sm mb-8">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{patient.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">DNI</p>
                            <p className="font-medium">{patient.dni}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{patient.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">{patient.address}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Appointments</h2>

                    {patient.appointments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No appointments found for this patient</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Medic
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Clinic
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {patient.appointments.map((appointment) => (
                                        <tr key={appointment.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{appointment.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {format(new Date(appointment.date), "MMM d, yyyy - h:mm a")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.state)}`}>
                                                    {appointment.state}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <p className="font-medium">{appointment.medic.name}</p>
                                                    {appointment.medic.speciality && (
                                                        <p className="text-xs text-gray-500">{appointment.medic.speciality}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <p className="font-medium">{appointment.clinic.name}</p>
                                                    {appointment.clinic.address && (
                                                        <p className="text-xs text-gray-500">{appointment.clinic.address}</p>
                                                    )}
                                                </div>
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
    )
}

