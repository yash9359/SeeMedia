import React from 'react'
import Spinner from '@/components/Spinner';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function PublicRoute({children}) {
  const {user, authChecked }= useSelector(state=>state.user);

  if(!authChecked) return <Spinner/>
    if(user?._id){
        return <Navigate to={"/"} />
    }

  return (
    children
  )
}

export default PublicRoute
