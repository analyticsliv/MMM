import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import default styles

const useToast = () => {
    const [toastId, setToastId] = useState(null);

    const notify = (message, type = 'info') => {
        if (toastId) {
            // If a toast is already displayed, close it before showing the new one
            toast.dismiss(toastId);
        }

        const newToastId = toast[type](message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
                backgroundColor: '#333',
                color: '#fff',
                fontSize: '16px',
                borderRadius: '8px',
                textAlign: 'center',
                // padding: '10px 20px',
            },
        });
        setToastId(newToastId);
    };

    return notify;
};

export default useToast;
