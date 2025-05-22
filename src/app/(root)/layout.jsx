"use client"

import { useAuth } from '@/context/authContext';
import React from 'react';

function AppLayout({ authenticated, unAuth }) {

    const { user } = useAuth();

    return (
        <>
            {
                user === null
                ? unAuth
                : authenticated
            }
        
        </>
    )
}

export default AppLayout;
