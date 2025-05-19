import React from 'react';

function AppLayout({ authenticated, unAuth }) {

    const user = null;

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
