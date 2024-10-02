import React from 'react'
import ClientDevice from './Client_device_creation'

export default function Device_list() {
    const userData = JSON.parse(localStorage.getItem("userData"))
    return (
        <div>
            <ClientDevice />
        </div>
    )
}
