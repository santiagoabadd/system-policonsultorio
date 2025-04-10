import type React from "react"
import { useEffect } from "react"
import { useState, type FormEvent } from "react"
import { callApi } from "../../helpers/axios_helper"
import { useAuth } from "../../auth/AuthContext"
import authService from "../../auth/authService"
interface Clinic {
    name: string
    id: string
}



export const MedicForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        specialty: "",
        clinicId: "",
        createAccount: "no",
        userName: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [errors, setErrors] = useState({
        name: "",
        specialty: "",
        userName: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    })


    const { user } = useAuth()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [clinic, setClinic] = useState<Clinic | null>(null)
    const [creationStep, setCreationStep] = useState<"idle" | "creating_account" | "creating_doctor">("idle")
    const [createdAuthUserId, setCreatedAuthUserId] = useState<string>("")

    const fetchClinic = async () => {
        try {
            const response = await callApi(`/api/policonsultorio/clinic/authUserId/${user?.id}`, "GET")

            if (!response) {
                throw new Error("Failed to fetch clinic")
            }

            console.log(response.data)
            setClinic(response.data)
        } catch (error) {
            console.error("Error fetching clinic:", error)
        }
    }

    useEffect(() => {
        if (user?.id) {
            fetchClinic()
        }
    }, [user?.id])

    useEffect(() => {
        if (clinic?.id) {
            setFormData((prev) => ({
                ...prev,
                clinicId: clinic.id,
            }))
        }
    }, [clinic])

    useEffect(() => {
        console.log(formData)
    }, [formData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const validateForm = () => {
        let isValid = true
        const newErrors = { ...errors }

        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
            isValid = false
        }

        if (!formData.specialty.trim()) {
            newErrors.specialty = "Specialty is required"
            isValid = false
        }

        if (formData.createAccount === "yes") {
            if (!formData.userName.trim()) {
                newErrors.userName = "Username is required"
                isValid = false
            }

            if (!formData.firstName.trim()) {
                newErrors.firstName = "First name is required"
                isValid = false
            }

            if (!formData.lastName.trim()) {
                newErrors.lastName = "Last name is required"
                isValid = false
            }
            if (!formData.email.trim()) {
                newErrors.email = "Email is required"
                isValid = false
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = "Please enter a valid email address"
                isValid = false
            }

            if (!formData.password) {
                newErrors.password = "Password is required"
                isValid = false
            } else if (formData.password.length < 6) {
                newErrors.password = "Password must be at least 6 characters"
                isValid = false
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match"
                isValid = false
            }
        }

        setErrors(newErrors)
        return isValid
    }

    const createUserAccount = async () => {
        try {
            setCreationStep("creating_account")


            const accountData = {
                userName: formData.userName,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                role: "MEDICO",
            }


            const response = await authService.register(accountData)
            console.log(response.id)
            if (!response || !response.id) {
                throw new Error("Failed to create user account")
            }

            setCreatedAuthUserId(response.id)
            console.log("aasfasfasfasf")
            return response.id
        } catch (error) {
            console.error("Error creating user account:", error)
            throw error
        }
    }



    const createDoctorRecord = async (authUserId: string) => {
        try {
            setCreationStep("creating_doctor")

            // Prepare doctor data
            const doctorData = {
                name: formData.name,
                specialty: formData.specialty,
                clinicId: formData.clinicId,
                authUserId: authUserId,
            }

            console.log(doctorData)

            const response = await callApi("/api/policonsultorio/medic/create", "POST", doctorData)

            if (!response) {
                throw new Error("Failed to create doctor record")
            }

            return response.data
        } catch (error) {
            console.error("Error creating doctor record:", error)
            throw error
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return
        setIsSubmitting(true)

        try {
            let authUserId = ""
            if (formData.createAccount === "yes") {
                authUserId = await createUserAccount()
            } else {
                authUserId = user?.id || ""
            }

            await createDoctorRecord(authUserId)

            setSubmitSuccess(true)
            setCreationStep("idle")

            setTimeout(() => {
                setFormData({
                    name: "",
                    specialty: "",
                    clinicId: formData.clinicId,
                    createAccount: "no",
                    userName: "",
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                })
                setCreatedAuthUserId("")
                setSubmitSuccess(false)
            }, 3000)

        } catch (error) {
            console.error("Error in registration process:", error)
            setCreationStep("idle")
        } finally {
            setIsSubmitting(false)
        }
    }

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

    const getStatusMessage = () => {
        if (creationStep === "creating_account") {
            return "Creating user account..."
        } else if (creationStep === "creating_doctor") {
            return "Registering doctor information..."
        } else if (isSubmitting) {
            return "Processing..."
        } else if (submitSuccess) {
            return "Doctor registered successfully!"
        }
        return null
    }

    const statusMessage = getStatusMessage()

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-8">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Doctor Registration</h2>

                    {statusMessage && (
                        <div
                            className={`mb-4 p-3 rounded ${submitSuccess ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                        >
                            {statusMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="createAccount" className="block text-sm font-medium text-gray-700">
                                Create Account for Doctor?
                            </label>
                            <select
                                id="createAccount"
                                name="createAccount"
                                value={formData.createAccount}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="no">No, use my account</option>
                                <option value="yes">Yes, create a new account for the doctor</option>
                            </select>
                            <p className="mt-1 text-sm text-gray-500">
                                {formData.createAccount === "no"
                                    ? "The doctor will be associated with your user account."
                                    : "A new user account will be created for the doctor."}
                            </p>
                        </div>
                        {formData.createAccount === "yes" && (
                            <div className="space-y-6 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full px-3 py-2 border ${errors.firstName ? "border-red-500" : "border-gray-300"
                                                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                        />
                                        {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full px-3 py-2 border ${errors.lastName ? "border-red-500" : "border-gray-300"
                                                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                        />
                                        {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                                        userName
                                    </label>
                                    <input
                                        type="text"
                                        id="userName"
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-3 py-2 border ${errors.userName ? "border-red-500" : "border-gray-300"
                                            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                    />
                                    {errors.userName && <p className="mt-1 text-sm text-red-600">{errors.userName}</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"
                                            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"
                                            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                    />
                                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                    />
                                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                                </div>
                            </div>
                        )}

                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900">Doctor Information</h3>

                            <div className="mt-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"
                                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div className="mt-4">
                                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                                    Medical Specialty
                                </label>
                                <select
                                    id="specialty"
                                    name="specialty"
                                    value={formData.specialty}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 border ${errors.specialty ? "border-red-500" : "border-gray-300"
                                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                >
                                    <option value="">Select a specialty</option>
                                    {specialties.map((specialty) => (
                                        <option key={specialty} value={specialty}>
                                            {specialty}
                                        </option>
                                    ))}
                                </select>
                                {errors.specialty && <p className="mt-1 text-sm text-red-600">{errors.specialty}</p>}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                                {isSubmitting ? "Processing..." : "Register Doctor"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
