import SuggestedUsers from '@/components/SuggestedUsers'
import React from 'react'
import Sidebar from '@/components/Sidebar'

function SuggestedUsersMainPage() {

    return (
        <div className='bg-linear-to-br from-black via-zinc-900 to-black text-white min-h-screen flex'>
            <Sidebar />

            <main className='flex-1 w-full overflow-auto p-4 sm:p-6 lg:p-8'>
                <div className='mx-auto w-full max-w-6xl'>
                    <SuggestedUsers showAllPage />
                </div>
            </main>
        </div>
    )
}

export default SuggestedUsersMainPage
