import WebSocketController from "./ConnectionManger";

const ConnectToserver = async(id, role) => {
    try{
        let connect = await WebSocketController.connect({
            logFunction: (message, type) => console.log(`[${type}] ${message}`),
            sendInitialMessage: true,
            initialMessage: { 
                name: "new-client", 
                data: {
                    id,
                    role
                }
             },
            onOpen: () => console.log('Connected successfully'),
            onClose: (event) => console.log('Connection closed', event),
            onError: (error) => console.error('Error occurred', error),
            onMessage: (message) => HandleIncomingMessage(message)
        });
        // return connect;
    }catch(err){
        console.log(err);
    }
    
}

const DisconnectFromServer = async () =>{
    try{
        await WebSocketController.disconnect({
            logFunction: (message, type) => console.log(`[${type}] ${message}`),
            code: 1000,
            reason: 'User requested disconnect'
        });
    }catch(err){
        console.log(err);
    }
}

const SendMessage = async (msg) =>{
    let ok = false;
    try{
        ok = await WebSocketController.sendMessage(
            msg,
            { logFunction: (message, type) => console.log(`[${type}] ${message}`) }
        );
    }catch(err){
        console.log(err);
    }
    return ok;
}

function HandleIncomingMessage(message) {
    // Process incoming messages
    console.log('Processing message:', message);
}

export {ConnectToserver, DisconnectFromServer, SendMessage, HandleIncomingMessage}