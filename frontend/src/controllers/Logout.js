import { deleteUser } from "../store/slices/user-slice";
import { DisconnectFromServer } from "./websocket/handler";

async function Logout(dispatch, navigate) {
    console.log('calling logout');
    try {
        const response = await fetch('https://auth-service-latest-qbm2.onrender.com/api/auth/logout', {
            method: 'DELETE',
            credentials: 'include' // Important to include cookies
        });
        
        let statusCode = response.status;
        console.log(statusCode);
        if (statusCode == 200){
            DisconnectFromServer();
            dispatch(deleteUser());
            navigate('/');
        }
        else{
            alert("Error occured. Please try again");
        }
    } catch (error) {
        console.log(error);
        alert("An unknown error occured. Please try again");
    }
}

export default Logout