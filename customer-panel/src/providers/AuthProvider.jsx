import React, { createContext, useState } from 'react'

// create a context to share the user details with all the components
export const AuthContext = createContext();
function AuthProvider({children}) {
    const [ user, setUser ] = useState(sessionStorage.getItem('user') || null);
  return (
    <div>
      <AuthContext.Provider value={{ user, setUser }}>
        {children}
      </AuthContext.Provider>
    </div>
  )
}

export default AuthProvider

//create a custom hook to access the context
export const useAuthContext = () => React.useContext(AuthContext);
