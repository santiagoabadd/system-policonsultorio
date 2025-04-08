import { useState } from "react"
import {  Menu,  LogOut, Activity } from "lucide-react"
import { useAuth } from "../../auth/AuthContext";
import { useEffect } from "react"

export const NavBar: React.FC= ()=>{

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const { user, logout } = useAuth();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
      }
    
    useEffect(() => {
          console.log(user)
        }, [user])
    
      const handleLogout = () => {
        logout()
      }

    return(
        <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-green-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">Medical Clinic</h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="text-sm text-gray-700">Welcome {user?.firstName} {user?.lastName}</div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>

          <button className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={toggleMobileMenu}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-2 px-4">
            <div className="flex flex-col space-y-2">
              <div className="text-sm text-gray-700 py-2">Welcome, Dr. Smith</div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>
    )
}