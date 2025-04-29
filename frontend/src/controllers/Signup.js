const handleSignUp = async (values, navigate) => {
    try {
        let response = await fetch('https://auth-service-latest-qbm2.onrender.com/api/auth/signup',
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
            alert("SignUp successfull");
            navigate('/login');
        }
        else if(statusCode == 422){
            alert(response.detail[0].msg)
        }
        else if (statusCode == 409) {
            alert("Email or Phone already taken")
        }
        else if(statusCode == 500){
            alert("Sorry, we're experiencing a technical issue on our server. Please try again later.")
        }
    }
    catch (err) {
        alert('Error: ', err);
    }
};

export default handleSignUp