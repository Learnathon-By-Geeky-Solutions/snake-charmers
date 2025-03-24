import store from "../store";

const UpdateLocation = async (coords) => {
    let currentState = {...store.getState().locationUpdateState}
    let user = {...store.getState().user}
    let data = {
        ...coords,
        driver_id: user.id
    }
    let type = (currentState.isAdded ? 'update': 'add');
    console.log(currentState)
    console.log(data);
    console.log(type);
    try {
        let response = await fetch(`http://localhost:9000/api/location/${type}`,
            {
                method: (type === 'add' ? 'POST' : 'PUT'),
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            })
        let statusCode = response.status;
        response = await response.json();

        if (statusCode == 200){
            console.log("Location updated")       
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

export default UpdateLocation