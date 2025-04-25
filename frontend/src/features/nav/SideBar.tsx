import type React from "react"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/AuthContext"
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Home,
  Calendar,
  Users,
  UserPlus,
  Clock,
  LogOut,
  Settings,
  User,
} from "lucide-react"

export const SideBar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {

    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState) {
      setIsCollapsed(savedState === "true")
    }


    if (user?.userName) {
      setUserName(user.userName)
    } else if (user?.email) {

      const emailName = user.email.split("@")[0]
      setUserName(emailName)
    }


    setIsMobileOpen(false)
  }, [user, location.pathname])


  useEffect(() => {
    if (isMobileOpen) {
      document.body.classList.add("sidebar-open")
    } else {
      document.body.classList.remove("sidebar-open")
    }

    return () => {
      document.body.classList.remove("sidebar-open")
    }
  }, [isMobileOpen])


  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add("sidebar-collapsed")
      document.body.classList.remove("sidebar-expanded")
    } else {
      document.body.classList.add("sidebar-expanded")
      document.body.classList.remove("sidebar-collapsed")
    }

    return () => {
      document.body.classList.remove("sidebar-collapsed", "sidebar-expanded")
    }
  }, [isCollapsed])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebarCollapsed", newState.toString())
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const handleLogout = () => {
    if (logout) {
      logout()
    }
  }

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") {
      return true
    }
    if (path !== "/" && location.pathname.startsWith(path)) {
      return true
    }
    return false
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false)
    }
  }


   const isLoginPage = location.pathname === "/login"


   if (isLoginPage) {
    document.body.classList.remove("sidebar-collapsed", "sidebar-expanded")
     return null
   }

  const navItems = [
    { path: "/", label: "Inicio", icon: Home },
    { path: "/menuEspecialidad", label: "Especialidades", icon: Settings },
    { path: "/pacientes", label: "Pacientes", icon: Users },
    { path: "/paciente/form", label: "Registrar Paciente", icon: UserPlus },
    { path: "/medicos", label: "Médicos", icon: Users },
    { path: "/medico/form", label: "Registrar Médico", icon: UserPlus },
    { path: "/home/medicos", label: "Portal Médico", icon: Calendar },
  ]

  return (
    <>
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md text-gray-700 hover:bg-gray-100 lg:hidden"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              {!isCollapsed && <span className="ml-2 text-xl font-semibold">MediApp</span>}
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="hidden lg:block p-2 rounded-md text-gray-500 hover:bg-gray-100"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-green-100 text-green-800"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600 ${
                isCollapsed ? "mx-auto" : "mr-3"
              }`}
            >
              <User className="h-6 w-6" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-xs text-gray-500 hover:text-gray-700 mt-1"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
