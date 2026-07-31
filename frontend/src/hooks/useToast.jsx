import { useState, useRef, useEffect } from 'react'

function useToast() {
    const [toast, setToast] = useState({ show: false, message: '', type: 'success', full: false })
    const timerRef = useRef(null)

    const triggerToast = (message, type = 'success') => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }

        setToast({ show: true, message, type, full: false })

        
        setTimeout(() => {
            setToast((prev) => ({ ...prev, full: true }))
        }, 20)

        // 2 second baad toast hide kar dete hain
        timerRef.current = setTimeout(() => {
            setToast({ show: false, message: '', type, full: false })
        }, 2000)
    }

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [])

    return { toast, triggerToast }
}

export default useToast