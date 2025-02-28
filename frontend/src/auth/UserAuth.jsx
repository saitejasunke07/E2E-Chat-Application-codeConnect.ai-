import React, { useContext, useEffect,useState } from 'react'
import {UserContext} from "../context/user.context"
import { useNavigate } from 'react-router-dom';
const UserAuth = ({children}) => {
    const {user,setUser} = useContext(UserContext);
    const localUser = JSON.parse(localStorage.getItem("user"));
    const [loading,setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(()=>{
        if(localUser){
            setLoading(false);
            setUser(localUser);
        }

        if(!token){
            navigate("/login");
        }
        if(!localUser){
            navigate("/login");
        }
    },[])

    if(loading){
        return <div>Loading....</div>
    }

    return (
      <>
          {children}
      </>
    )
}

export default UserAuth
