import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = 'http://localhost:5000/api/auth'

interface User {
    id: string
    username: string
    email: string
    age: number
    favorites: string[]
    createdAt: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    signup: (username: string, email: string, password: string, age: number) => Promise<void>
    logout: () => void
    toggleFavorite: (destinationId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // Check for existing token on mount
    useEffect(() => {
        const token = localStorage.getItem('md_token')
        if (token) {
            fetchProfile(token)
        } else {
            setLoading(false)
        }
    }, [])

    const fetchProfile = async (token: string) => {
        try {
            const res = await axios.get(`${API_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUser(res.data.user)
        } catch {
            localStorage.removeItem('md_token')
        } finally {
            setLoading(false)
        }
    }

    const login = async (email: string, password: string) => {
        const res = await axios.post(`${API_URL}/login`, { email, password })
        localStorage.setItem('md_token', res.data.token)
        setUser(res.data.user)
    }

    const signup = async (username: string, email: string, password: string, age: number) => {
        const res = await axios.post(`${API_URL}/signup`, { username, email, password, age })
        localStorage.setItem('md_token', res.data.token)
        setUser(res.data.user)
    }

    const logout = () => {
        localStorage.removeItem('md_token')
        setUser(null)
    }

    const toggleFavorite = async (destinationId: string) => {
        if (!user) {
            toast.error('Please login to save favorites')
            return
        }
        try {
            const token = localStorage.getItem('md_token')
            const res = await axios.post(`${API_URL}/favorites`,
                { destinationId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setUser({ ...user, favorites: res.data.favorites })

            const isRemoved = user.favorites.includes(destinationId)
            toast.success(isRemoved ? 'Removed from favorites' : 'Added to favorites')
        } catch (error) {
            console.error('Toggle favorite error:', error)
            toast.error('Failed to update favorites')
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, toggleFavorite }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
