import React from 'react'
export default function PopupPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="bg-background p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Popup Page</h1>
                <p className="text-primary-foreground">
                    This is a popup page. You can add any content you want here.
                </p>
            </div>
        </div>
    )
}
