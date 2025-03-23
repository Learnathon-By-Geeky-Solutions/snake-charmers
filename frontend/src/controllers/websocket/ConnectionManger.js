// WebSocket Controller Module
const WebSocketController = (function() {
  // Private variables with proper naming
  let socket = null;
  const SERVER_URL = 'ws://localhost:8080/ws'; // Fixed the quote issue in the URL
  
  // Enhanced logging with consistent error handling
  function log(message, type, logFunction) {
    if (typeof logFunction === 'function') {
      try {
        logFunction(message, type);
      } catch (error) {
        console.error('Logging error:', error);
      }
    }
  }
  
  // Improved connection management with proper Promise handling
  function connect(options = {}) {
    const logFunction = options.logFunction || console.log;
    
    // Return early if already connected
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      log('Connection already established or in progress', 'system', logFunction);
      return Promise.resolve(false);
    }
    
    return new Promise((resolve, reject) => {
      try {
        // Set connection timeout
        const connectionTimeout = setTimeout(() => {
          if (socket && socket.readyState !== WebSocket.OPEN) {
            socket.close();
            reject(new Error('Connection timeout'));
          }
        }, options.timeout || 10000);
        
        socket = new WebSocket(SERVER_URL);
        
        socket.onopen = () => {
          clearTimeout(connectionTimeout);
          log(`Connected to ${SERVER_URL}`, 'system', logFunction);
          
          if (typeof options.onOpen === 'function') {
            try {
              options.onOpen();
            } catch (error) {
              log(`Error in onOpen handler: ${error.message}`, 'system', logFunction);
            }
          }
          
          // Send initial message if specified
          if (options.sendInitialMessage && options.initialMessage) {
            sendMessage(options.initialMessage, { logFunction });
          }
          
          resolve(true);
        };
        
        socket.onclose = (event) => {
          clearTimeout(connectionTimeout);
          log(`Disconnected from server. Code: ${event.code}, Reason: ${event.reason || 'No reason provided'}`, 'system', logFunction);
          
          if (typeof options.onClose === 'function') {
            try {
              options.onClose(event);
            } catch (error) {
              log(`Error in onClose handler: ${error.message}`, 'system', logFunction);
            }
          }
          
          socket = null;
          
          // Only reject if this is an unexpected closure and connection was never established
          if (!event.wasClean && (event.code !== 1000 && event.code !== 1001)) {
            reject(new Error(`Connection failed: ${event.reason || 'Unknown reason'}`));
          }
        };
        
        socket.onerror = (error) => {
          clearTimeout(connectionTimeout);
          const errorMessage = error.message || 'Unknown error';
          log(`WebSocket error: ${errorMessage}`, 'system', logFunction);
          
          if (typeof options.onError === 'function') {
            try {
              options.onError(error);
            } catch (handlerError) {
              log(`Error in onError handler: ${handlerError.message}`, 'system', logFunction);
            }
          }
          
          // Don't reject here as the onclose handler will be called next
        };
        
        socket.onmessage = (event) => {
          if (typeof options.onMessage === 'function') {
            try {
              let parsedMessage = event.data;
              
              // Try to parse JSON if it looks like JSON
              if (typeof event.data === 'string' && 
                  (event.data.startsWith('{') || event.data.startsWith('['))) {
                try {
                  parsedMessage = JSON.parse(event.data);
                } catch (e) {
                  // Not valid JSON, use as is
                }
              }
              
              log(`Received: ${event.data}`, 'received', logFunction);
              options.onMessage(parsedMessage /*, options.dispatch*/);
            } catch (error) {
              log(`Error processing message: ${error.message}`, 'system', logFunction);
            }
          }
        };
        
      } catch (error) {
        log(`Failed to connect: ${error.message}`, 'system', logFunction);
        reject(error);
      }
    });
  }
  
  // Enhanced disconnect with proper Promise handling
  function disconnect(options = {}) {
    const logFunction = options.logFunction || console.log;
    
    if (!socket) {
      log('Not connected, nothing to disconnect', 'system', logFunction);
      return Promise.resolve(false);
    }
    
    return new Promise((resolve) => {
      try {
        const code = options.code || 1000; // Normal closure
        const reason = options.reason || 'Client initiated disconnect';
        
        // Set a timeout to force resolution in case onclose doesn't fire
        const closeTimeout = setTimeout(() => {
          log('Forced disconnect resolution after timeout', 'system', logFunction);
          socket = null;
          resolve(true);
        }, options.timeout || 5000);
        
        // Create a one-time onclose handler
        const onCloseHandler = (event) => {
          clearTimeout(closeTimeout);
          if (typeof options.onClose === 'function') {
            try {
              options.onClose(event);
            } catch (error) {
              log(`Error in onClose handler: ${error.message}`, 'system', logFunction);
            }
          }
          resolve(true);
        };
        
        // Replace existing onclose with our handler
        const originalOnClose = socket.onclose;
        socket.onclose = onCloseHandler;
        
        socket.close(code, reason);
      } catch (error) {
        log(`Failed to disconnect: ${error.message}`, 'system', logFunction);
        socket = null; // Ensure we clear the socket reference
        resolve(false);
      }
    });
  }
  
  // Enhanced message sending with retry capability
  function sendMessage(message, options = {}) {
    const logFunction = options.logFunction || console.log;
    const maxRetries = options.maxRetries || 0;
    let retryCount = 0;
    
    function attemptSend() {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        if (retryCount < maxRetries) {
          retryCount++;
          log(`Connection not ready, retrying (${retryCount}/${maxRetries})...`, 'system', logFunction);
          
          // Exponential backoff
          setTimeout(attemptSend, Math.min(1000 * Math.pow(2, retryCount), 30000));
          return Promise.resolve(false);
        }
        
        log('Not connected or not ready', 'system', logFunction);
        return Promise.resolve(false);
      }
      
      try {
        let messageToSend = message;
        
        // If message is an object, stringify it
        if (typeof message === 'object' && message !== null) {
          try {
            messageToSend = JSON.stringify(message);
          } catch (error) {
            log(`Failed to stringify message: ${error.message}`, 'system', logFunction);
            return Promise.reject(error);
          }
        }
        
        socket.send(messageToSend);
        log(`Sent: ${messageToSend}`, 'sent', logFunction);
        
        if (typeof options.onSend === 'function') {
          try {
            options.onSend(message);
          } catch (error) {
            log(`Error in onSend handler: ${error.message}`, 'system', logFunction);
          }
        }
        
        return Promise.resolve(true);
      } catch (error) {
        log(`Failed to send message: ${error.message}`, 'system', logFunction);
        return Promise.reject(error);
      }
    }
    
    return attemptSend();
  }
  
  // Enhanced connection status check
  function isConnected() {
    return socket !== null && socket.readyState === WebSocket.OPEN;
  }
  
  // Get connection state details
  function getConnectionState() {
    if (!socket) {
      return { connected: false, state: 'CLOSED', stateCode: WebSocket.CLOSED };
    }
    
    const states = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
    return {
      connected: socket.readyState === WebSocket.OPEN,
      state: states[socket.readyState] || 'UNKNOWN',
      stateCode: socket.readyState
    };
  }
  
  // Get socket instance (for advanced usage) with safety check
  function getSocket() {
    return socket;
  }
  
  // Return public API
  return {
    connect,
    disconnect,
    sendMessage,
    isConnected,
    getConnectionState,
    getSocket
  };
})();

export default WebSocketController;