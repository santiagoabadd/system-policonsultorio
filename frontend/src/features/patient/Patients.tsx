import type React from "react"
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import { callApi } from "../../helpers/axios_helper"

interface Patient {
  id: string
  name: string
  phone: string
  address: string
  dni: string
}

export const Patients: React.FC = () => {

    let navigate = useNavigate()

    const [nameFilter, setNameFilter] = useState('');
    const [dniFilter, setDniFilter] = useState('');
    const [phoneFilter, setPhoneFilter] = useState('');
    const [addressFilter, setAddressFilter] = useState('');


  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)

    
    

      const fetchPatients = async () => {
        setIsLoading(true)
        try {
   
          const response = await callApi(`/api/policonsultorio/patient/patients`,"GET",undefined,{
            partialName: nameFilter || undefined,
            partialDni: dniFilter || undefined,
            partialPhone: phoneFilter || undefined,
            partialAddress: addressFilter || undefined
          })
  
          if (!response) {
            throw new Error("Failed to fetch patients")
          }
  
         
          setPatients(response.data)
        } catch (error) {
          console.error("Error fetching patients:", error)
        } finally {
          setIsLoading(false)
        }
      }
  

  useEffect(() => {
    
    fetchPatients()
  }, [nameFilter, dniFilter, phoneFilter, addressFilter])

  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    switch (name) {
      case 'nameFilter':
        setNameFilter(value);
        break;
      case 'dniFilter':
        setDniFilter(value);
        break;
      case 'phoneFilter':
        setPhoneFilter(value);
        break;
      case 'addressilter':
        setAddressFilter(value);  
        break;
      default:
        break;
    }
  };

  const handlePatientClick = (id: string)=>{
    navigate(`/paciente/${id}`);
};
 

  return (
    <div className="container mx-auto py-10">
      <button onClick={()=> navigate(-1)} className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md">
                    Back
                </button>
      <h1 className="text-3xl font-bold mb-6">Patients</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <label htmlFor="dni" className="text-sm font-medium">
                    DNI
                  </label>
                  <input
                    id="dni"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="Search by DNI"
                    name="dniFilter"
                    value={dniFilter}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone
                  </label>
                  <input
                    id="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="Search by phone"
                    name="phoneFilter"
                    value={phoneFilter}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address
                  </label>
                  <input
                    id="address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="Search by address"
                    name="addressFilter"
                    value={addressFilter}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

             
            </div>
          </div>
        </div>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 w-full bg-gray-200 animate-pulse rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 w-full bg-gray-200 animate-pulse rounded"></div>
                    </td>
                  </tr>
                ))
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No patients found
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id}  onClick={() =>  handlePatientClick(`${patient.id}`)}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{patient.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.dni}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.address}</td>
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
