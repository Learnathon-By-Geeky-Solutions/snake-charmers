import { deleteUser, setUser } from "../store/slices/user-slice";
import { DisconnectFromServer } from "./websocket/handler";

async function validateToken(navigate, location, dispatch, role) {
    const path = location.pathname;
    if(path === '/login' || path === '/signup'){
        return;        
    }
    try {
        let response = await fetch('http://localhost:7000/api/auth/validate-token', {
            method: 'GET',
            credentials: 'include', // Ensures cookies are sent with the request
        });

        let statusCode = response.status;
        response = await response.json();
        
        if (statusCode == 200){
            console.log(response);
            dispatch(setUser(response));
        }
        else if (statusCode == 401 && role === '') {
            dispatch(deleteUser());
            DisconnectFromServer();
        }
        else if(statusCode == 500){
            alert("Sorry, we're experiencing a technical issue on our server. Please try again later");
        }

    } catch (error) {
        console.log(error);
        alert("Error connecting to the server. Please try again later");
    }
}

export default validateToken;
