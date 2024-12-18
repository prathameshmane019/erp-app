'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import api from './api'
import { useRouter } from 'next/router'
const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
 
    localStorage.removeItem('user')
    
  }
  const updateUser = async (userData ) => {
    if (!user) return;
    await api.put(`/${userData.role}?_id=${userData._id}`,userData)
    try {
      setUser({ ...user, ...userData });
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout,updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    return { user: null, token: null, login: () => {}, logout: () => {} }
  }
  return context
}

