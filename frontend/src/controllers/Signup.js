const handleSignUp = async (values) => {
    try {
        let response = await fetch('http://localhost:7000/api/auth/signup',
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
        
        if (statusCode == 201){
            console.log("SignUp successfull")
        }
        else if(statusCode == 422){
            console.log(response.detail[0].msg)
        }
        else if (statusCode == 409) {
            console.log("Email or Phone already taken")
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

export default handleSignUp