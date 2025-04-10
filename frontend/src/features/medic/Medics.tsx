import type React from "react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { callApi } from "../../helpers/axios_helper"
import { useAuth } from "../../auth/AuthContext"

interface Medic {
  id: string
  name: string
  specialty: string
  authUserId: string
}

interface Clinic {
  name: string
  id: string
}

export const Medics: React.FC = () => {
  const { user } = useAuth()

  const navigate = useNavigate()

  const [nameFilter, setNameFilter] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState("")
  const [clinic, setClinic] = useState<Clinic | null>(null)

  const [doctors, setDoctors] = useState<Medic[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchDoctors = async () => {
    setIsLoading(true)
    try {
      const response = await callApi(`/api/policonsultorio/medic/medics`, "GET", undefined, {
        partialName: nameFilter || undefined,
        partialSpecialty: specialtyFilter || undefined,
        partialClinicId: clinic?.id
      })

      if (!response) {
        throw new Error("Failed to fetch doctors")
      }

      setDoctors(response.data)
    } catch (error) {
      console.error("Error fetching doctors:", error)
    } finally {
      setIsLoading(false)
    }
  }

  

  const fetchClinic = async () => {
    try {
      const response = await callApi(`/api/policonsultorio/clinic/authUserId/${user?.id}`, "GET")

      if (!response) {
        throw new Error("Failed to fetch clinic")
      }

      console.log(response.data)
      setClinic(response.data)
      console.log(clinic)
    } catch (error) {
      console.error("Error fetching clinic:", error)
    }
    console.log(clinic?.id)
  }

  useEffect(() => {
    if (user?.id) {
      fetchClinic()
    }
  }, [user?.id])

  useEffect(() => {
    fetchDoctors()
  }, [nameFilter, specialtyFilter, clinic])

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    switch (name) {
      case "nameFilter":
        setNameFilter(value)
        break
      case "specialtyFilter":
        setSpecialtyFilter(value)
        break
      default:
        break
    }
  }

  const handleDoctorClick = (id: string) => {
    navigate(`/medic/${id}`)
  }

  return (
    <div className="container mx-auto py-10">
      <button
        onClick={() => navigate(-1)}
        className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
      >
        Back
      </button>
      <h1 className="text-3xl font-bold mb-6">Doctors</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <input
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="Search by name"
                    name="nameFilter"
                    value={nameFilter}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="specialty" className="text-sm font-medium">
                    Specialty
                  </label>
                  <input
                    id="specialty"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="Search by specialty"
                    name="specialtyFilter"
                    value={specialtyFilter}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/doctor/form")}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Add New Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialty
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 w-full bg-gray-200 animate-pulse rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 w-full bg-gray-200 animate-pulse rounded"></div>
                    </td>
                  </tr>
                ))
              ) : doctors.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center py-6 text-gray-500">
                    No doctors found
                  </td>
                </tr>
              ) : (
                doctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    onClick={() => handleDoctorClick(`${doctor.id}`)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{doctor.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.specialty}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}