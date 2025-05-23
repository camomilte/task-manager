"use client"

import { useAuth } from '@/context/authContext';
import { Loader2Icon } from 'lucide-react';
import React from 'react';

function AppLayout({ authenticated, unAuth }) {

    const { user, authLoaded } = useAuth();

    if(!authLoaded) {
        return (
            <div className='flex items-center justify-center h-svh'>
                <Loader2Icon className='size-20 animate-spin text-primary'/>
            </div>
        )
    }

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
