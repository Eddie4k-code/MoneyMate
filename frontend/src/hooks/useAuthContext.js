// This code defines a custom hook called useAuthContext, which provides access to the AuthContext object using the useContext hook from the React library. The AuthContext object provides authentication-related data and functionality to its descendants in the component tree.

import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

// This hook makes it easier for components that need to access the AuthContext object to do so without having to pass the context down through multiple levels of props. By calling useAuthContext within a component, that component can directly access the authentication-related data and functions provided by the AuthContext object.

// If the AuthContext object is not found when useAuthContext is called, the hook throws an error indicating that it must be used inside an AuthContextProvider. This ensures that the hook is only used within a component tree that has been wrapped in an AuthContextProvider, which is responsible for providing the AuthContext object to its descendants.

export const useAuthContext = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw Error('useAuthConterxt must be used inside an AuthContextProvider')
    }

    return context
}