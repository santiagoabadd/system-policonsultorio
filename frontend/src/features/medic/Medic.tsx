import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { callApi } from "../../helpers/axios_helper"

interface MedicScheduleResponse {
  id: number
  dayOfWeek: string
  startTime: string
  endTime: string
}

interface Medic {
  id: number
  name: string
  specialty: string
  authUserId: string
  schedule: MedicScheduleResponse[]
}

interface MedicProps {
  id: string
}

export const Medic: React.FC<MedicProps> = (id) => {
  const navigate = useNavigate()

 
  const [medic, setMedic] = useState<Medic | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showAddScheduleForm, setShowAddScheduleForm] = useState(false)
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false)
  const [scheduleSuccess, setScheduleSuccess] = useState(false)
  const [scheduleError, setScheduleError] = useState<string | null>(null)

  const [scheduleForm, setScheduleForm] = useState({
    dayOfWeek: "",
    startTime: "09:00",
    endTime: "17:00",
    active: true,
  })


  useEffect(() => {
    const fetchMedicData = async () => {
      setIsLoading(true)
      try {
        const response = await callApi(`/api/policonsultorio/medic/${id.id}`)

        if (!response) {
          throw new Error("Failed to fetch medic data")
        }

        setMedic(response.data)
      } catch (error) {
        console.error("Error fetching doctor:", error)
        setError("Failed to load doctor information")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchMedicData()
    }
  }, [id])

  const handleBack = () => {
    navigate(-1)
  }

  const getActiveStatusColor = (active: boolean) => {
    return active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const daysOfWeek = [
    { value: "MONDAY", label: "Monday" },
    { value: "TUESDAY", label: "Tuesday" },
    { value: "WEDNESDAY", label: "Wednesday" },
    { value: "THURSDAY", label: "Thursday" },
    { value: "FRIDAY", label: "Friday" },
    { value: "SATURDAY", label: "Saturday" },
    { value: "SUNDAY", label: "Sunday" },
  ]


  const getDayOfWeekLabel = (dayOfWeek: string) => {
    const days: Record<string, string> = {
      MONDAY: "Monday",
      TUESDAY: "Tuesday",
      WEDNESDAY: "Wednesday",
      THURSDAY: "Thursday",
      FRIDAY: "Friday",
      SATURDAY: "Saturday",
      SUNDAY: "Sunday",
    }
    return days[dayOfWeek] || dayOfWeek
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const handleScheduleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setScheduleForm((prev) => ({
        ...prev,
        [name]: checked,
      }))
    } else {
      setScheduleForm((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    // Clear success/error messages when form changes
    setScheduleSuccess(false)
    setScheduleError(null)
  }
  const validateScheduleForm = () => {
    if (!scheduleForm.dayOfWeek) {
      setScheduleError("Please select a day of the week")
      return false
    }

    if (!scheduleForm.startTime) {
      setScheduleError("Please enter a start time")
      return false
    }

    if (!scheduleForm.endTime) {
      setScheduleError("Please enter an end time")
      return false
    }

    // Check if end time is after start time
    if (scheduleForm.startTime >= scheduleForm.endTime) {
      setScheduleError("End time must be after start time")
      return false
    }

    return true
  }

  const handleSubmitSchedule = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateScheduleForm()) return

    setIsSubmittingSchedule(true)
    setScheduleError(null)

    try {
      // Format the schedule data for the API
      const scheduleData = {
        medicId: medic?.id,
        dayOfWeek: scheduleForm.dayOfWeek,
        startTime: scheduleForm.startTime,
        endTime: scheduleForm.endTime, 

      }

      const response = await callApi("/api/policonsultorio/medicSchedule/create", "POST", scheduleData)

      if (!response) {
        throw new Error("Failed to create schedule")
      }


      if (medic) {
        const newSchedule = response.data
        setMedic({
          ...medic,
          schedule: [...medic.schedule, newSchedule],
        })
      }

      setScheduleSuccess(true)

      // Reset form after successful submission
      setScheduleForm({
        dayOfWeek: "",
        startTime: "09:00",
        endTime: "17:00",
        active: true,
      })

      // Hide form after a delay
      setTimeout(() => {
        setShowAddScheduleForm(false)
        setScheduleSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("Error creating schedule:", error)
      setScheduleError("Failed to create schedule. Please try again.")
    } finally {
      setIsSubmittingSchedule(false)
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
          Back to Doctors
        </button>
      </div>
    )
  }

  if (!medic) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Doctor not found</span>
        </div>
        <button onClick={handleBack} className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md">
          Back to Doctors
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
        <h1 className="text-3xl font-bold">Doctor Details</h1>
      </div>
      <div className="bg-white rounded-lg border shadow-sm mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Doctor Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{medic.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Specialty</p>
              <p className="font-medium">{medic.specialty}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Schedules</h2>
            <button
              onClick={() => setShowAddScheduleForm(!showAddScheduleForm)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {showAddScheduleForm ? "Cancel" : "Add Schedule"}
            </button>
          </div>

          {showAddScheduleForm && (
            <div className="mb-6 bg-gray-50 p-4 rounded-md border">
              <h3 className="text-lg font-medium mb-4">Add New Schedule</h3>

              {scheduleSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Schedule added successfully!</div>
              )}

              {scheduleError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{scheduleError}</div>}

              <form onSubmit={handleSubmitSchedule} className="space-y-4">
                <div>
                  <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700">
                    Day of Week
                  </label>
                  <select
                    id="dayOfWeek"
                    name="dayOfWeek"
                    value={scheduleForm.dayOfWeek}
                    onChange={handleScheduleFormChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select a day</option>
                    {daysOfWeek.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                      Start Time
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={scheduleForm.startTime}
                      onChange={handleScheduleFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                      End Time
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={scheduleForm.endTime}
                      onChange={handleScheduleFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={scheduleForm.active}
                    onChange={handleScheduleFormChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingSchedule}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isSubmittingSchedule ? "Saving..." : "Save Schedule"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {!medic.schedule || medic.schedule.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No schedules found for this doctor</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medic.schedule.map((schedule) => (
                    <tr key={schedule.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {getDayOfWeekLabel(schedule.dayOfWeek)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatTime(schedule.startTime)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatTime(schedule.endTime)}</td>
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
