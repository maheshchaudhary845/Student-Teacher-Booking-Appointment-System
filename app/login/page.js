"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/UserContext";

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { refreshUser } = useUser();

    const router = useRouter()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || "Login failed")
                setLoading(false)
                return
            }


            console.log("Login successful:", data)
            await refreshUser()
            router.push("/dashboard")
        } catch (error) {
            console.error("Login error:", error)
            setError("Something went wrong")
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm"
            >
                <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

                {error && (
                    <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-center">
                        {error}
                    </p>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
                <p className="text-center mt-4 text-sm">
                    Not registered yet?{" "}
                    <span
                        onClick={() => router.push("/register")}
                        className="text-blue-600 hover:underline cursor-pointer"
                    >
                        Create an account
                    </span>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;