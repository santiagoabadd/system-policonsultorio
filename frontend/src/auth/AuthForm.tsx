import type React from "react"
import { useState } from "react"
import authService from "./authService"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="grid w-full grid-cols-2">
            <button
              onClick={() => setActiveTab("login")}
              className={`relative py-4 font-medium transition-all duration-200 ${
                activeTab === "login" ? "bg-white text-gray-900" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              Login
              {activeTab === "login" && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gray-900"></span>}
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`relative py-4 font-medium transition-all duration-200 ${
                activeTab === "register" ? "bg-white text-gray-900" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              Register
              {activeTab === "register" && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gray-900"></span>}
            </button>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  )
}

function LoginForm() {
  const [userName, setUserName] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("seteando")
      await authService.login({ userName, password })
      window.location.href = "/"
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="border-b border-gray-100 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-600">Enter your credentials to access your account</p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        <div className="space-y-5">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Username or Email"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <a href="#" className="text-xs font-medium text-gray-700 hover:text-gray-900">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <div className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                {error}
              </div>
            </div>
          )}
        </div>
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${
              isLoading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="mr-2 h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

function RegisterForm() {
  const [userName, setUserName] = useState<string>("")
  const [role, setRole] = useState<string>("PACIENTE")
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await authService.register({ userName, firstName, lastName, email, password, role})
      window.location.href = "/login"
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="border-b border-gray-100 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
        <p className="mt-2 text-sm text-gray-600">Enter your information to create a new account</p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        <div className="space-y-5">
          <div>
            <label htmlFor="register-username" className="mb-1.5 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="register-username"
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="first-name" className="mb-1.5 block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="first-name"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label htmlFor="last-name" className="mb-1.5 block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="last-name"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label htmlFor="register-password" className="mb-1.5 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <div className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                {error}
              </div>
            </div>
          )}
        </div>
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${
              isLoading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="mr-2 h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating account...
              </div>
            ) : (
              "Create account"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

