import { setUser } from "../store/slices/user-slice";

const handleLogin = async (values, dispatch, navigate) => {
    try {
        let response = await fetch('http://localhost:7000/api/auth/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values),
                credentials: 'include'
            })
        let statusCode = response.status;
        response = await response.json();

        if (statusCode == 200){
            console.log("Login successfull")
            dispatch(setUser(response));
            
            if(response.role == 'rider'){
                navigate('/ride_request');
            }else{
                navigate('/available_ride')
            }    
        }
        else if (statusCode == 401) {
            console.log("Invalid Credentials")
            // showError(response.)
        }
        else if(statusCode == 500){
            console.log("Sorry, we're experiencing a technical issue on our server. Please try again later.")
        }
    }
    catch (err) {
        console.log('Error: ', err);
        // showError('An error occured. Please try again.')
    }
};

export default handleLogin