import { ProtectedRoute } from '@/components/protected-route'
import React from 'react'

const layout = ({ children }) => {
    return (
    <ProtectedRoute>{children}</ProtectedRoute>)
}

export default layout
