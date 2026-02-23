import { setAuthStatus } from '@/store/slices/authSlice'
import axios, { AxiosError } from 'axios'
import { useDispatch } from 'react-redux'

const axiosSecure = axios.create({ baseURL: `${import.meta.env.VITE_BASE_UPL}/api`, withCredentials: true })
const axiosPublic = axios.create({ baseURL: `${import.meta.env.VITE_BASE_UPL}/api` })

const useAxiosInstance = () => {
    const dispatch = useDispatch();
    axiosSecure.interceptors.response.use(
        response => response, // Return successful response
        error => {
            // Only handle AxiosError
            if (error instanceof AxiosError) {
                const customMessage = error.response?.data?.error?.message;
                dispatch(setAuthStatus({isAuthenticated: false}))
                if (customMessage) {
                    // Override the original message with the backend error message
                    error.message = customMessage;
                }
            } else {
                console.error("Unexpected error:", error);
                error.message = "Unexpected error occurred";
            }

            // Forward the error with the updated message
            return Promise.reject(error);
        }
    );

    axiosPublic.interceptors.response.use(
        response => response, // Return successful response
        error => {
            // Only handle AxiosError
            if (error instanceof AxiosError) {
                const customMessage = error.response?.data?.error?.message;

                if (customMessage) {
                    // Override the original message with the backend error message
                    error.message = customMessage;
                }
            } else {
                console.error("Unexpected error:", error);
                error.message = "Unexpected error occurred";
            }

            // Forward the error with the updated message
            return Promise.reject(error);
        }
    );

    return {
        axiosSecure,
        axiosPublic
    }
}

export default useAxiosInstance