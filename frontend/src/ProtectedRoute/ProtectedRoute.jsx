import Spinner from '@/components/Spinner';
import React, { Children } from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({children}) {

    const { user, authChecked } = useSelector(state => state.user);
    const isAuthenticated = user?._id;;

    if(!authChecked) return <Spinner/>

    if(!isAuthenticated) return <Navigate to="/login" />


    return children
}

export default ProtectedRoute
