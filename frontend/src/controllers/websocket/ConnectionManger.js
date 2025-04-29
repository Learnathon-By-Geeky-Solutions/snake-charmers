// WebSocketController Module
const WebSocketController = (function() {
  // Private variables
  let socket = null;
  const SERVER_URL = `wss://coordinator-service-latest.onrender.com/ws`;
  
  // Connection states as constants
  const CONNECTION_STATES = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
  };
  
  const STATE_NAMES = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
  
  // Logging module to encapsulate logging logic
  const Logger = {
    log(message, type, logFunction) {
      if (typeof logFunction !== 'function') return;
      
      try {
        logFunction(message, type);
      } catch (error) {
        console.error('Logging error:', error);
      }
    }
  };
  
  // Callback handler module
  const CallbackHandler = {
    execute(callback, param, logFunction) {
      if (typeof callback !== 'function') return;
      
      try {
        callback(param);
      } catch (error) {
        Logger.log(`Error in callback handler: ${error.message}`, 'system', logFunction);
      }
    }
  };
  
  // Message processor module
  const MessageProcessor = {
    parse(data) {
      if (typeof data !== 'string') return data;
      if (!data.startsWith('{') && !data.startsWith('[')) return data;
      
      try {
        return JSON.parse(data);
      } catch (e) {
        console.log(e);
        return data;
      }
    },
    
    stringify(message) {
      if (typeof message !== 'object' || message === null) {
        return message;
      }
      
      try {
        return JSON.stringify(message);
      } catch (error) {
        throw new Error(`Failed to stringify message: ${error.message}`);
      }
    }
  };
  
  // Socket event handlers object
  const createSocketHandlers = (options, connectionTimeout, resolve, reject) => {
    const logFunction = options.logFunction || console.log;
    
    return {
      handleOpen() {
        clearTimeout(connectionTimeout);
        Logger.log(`Connected to ${SERVER_URL}`, 'system', logFunction);
        
        CallbackHandler.execute(options.onOpen, null, logFunction);
        
        if (options.sendInitialMessage && options.initialMessage) {
          sendMessage(options.initialMessage, { logFunction });
        }
        
        resolve(true);
      },
      
      handleClose(event) {
        clearTimeout(connectionTimeout);
        Logger.log(`Disconnected from server. Code: ${event.code}, Reason: ${event.reason || 'No reason provided'}`, 'system', logFunction);
        
        CallbackHandler.execute(options.onClose, event, logFunction);
        
        socket = null;
        
        const isAbnormalClosure = !event.wasClean && (event.code !== 1000 && event.code !== 1001);
        if (isAbnormalClosure) {
          reject(new Error(`Connection failed: ${event.reason || 'Unknown reason'}`));
        }
      },
      
      handleError(error) {
        clearTimeout(connectionTimeout);
        const errorMessage = error.message || 'Unknown error';
        Logger.log(`WebSocket error: ${errorMessage}`, 'system', logFunction);
        
        CallbackHandler.execute(options.onError, error, logFunction);
      },
      
      handleMessage(event) {
        if (typeof options.onMessage !== 'function') return;
        
        try {
          const parsedMessage = MessageProcessor.parse(event.data);
          Logger.log(`Received: ${event.data}`, 'received', logFunction);
          options.onMessage(parsedMessage);
        } catch (error) {
          Logger.log(`Error processing message: ${error.message}`, 'system', logFunction);
        }
      }
    };
  };
  
  // Setup socket with handlers
  function setupSocket(options, resolve, reject) {
    const logFunction = options.logFunction || console.log;
    
    try {
      const connectionTimeout = setTimeout(() => {
        if (socket && socket.readyState !== CONNECTION_STATES.OPEN) {
          socket.close();
          reject(new Error('Connection timeout'));
        }
      }, options.timeout || 10000);
      
      socket = new WebSocket(SERVER_URL);
      
      const handlers = createSocketHandlers(options, connectionTimeout, resolve, reject);
      
      socket.onopen = handlers.handleOpen;
      socket.onclose = handlers.handleClose;
      socket.onerror = handlers.handleError;
      socket.onmessage = handlers.handleMessage;
      
    } catch (error) {
      Logger.log(`Failed to connect: ${error.message}`, 'system', logFunction);
      reject(error);
    }
  }
  
  // Send logic with exponential backoff
  function createSendFunction(message, options) {
    const logFunction = options.logFunction || console.log;
    const maxRetries = options.maxRetries || 0;
    let retryCount = 0;
    
    return function attemptSend() {
      // Check socket readiness
      if (!isConnectionReady()) {
        return handleSendRetry(retryCount, maxRetries, message, options, attemptSend);
      }
      
      // Perform send
      try {
        const messageToSend = MessageProcessor.stringify(message);
        
        socket.send(messageToSend);
        Logger.log(`Sent: ${messageToSend}`, 'sent', logFunction);
        
        CallbackHandler.execute(options.onSend, message, logFunction);
        
        return Promise.resolve(true);
      } catch (error) {
        Logger.log(`Failed to send message: ${error.message}`, 'system', logFunction);
        return Promise.reject(error);
      }
    };
  }
  
  // Helper for connection check before sending
  function isConnectionReady() {
    return socket && socket.readyState === CONNECTION_STATES.OPEN;
  }
  
  // Helper for send retry logic
  function handleSendRetry(retryCount, maxRetries, message, options, attemptSendFn) {
    const logFunction = options.logFunction || console.log;
    
    if (retryCount < maxRetries) {
      const newRetryCount = retryCount + 1;
      Logger.log(`Connection not ready, retrying (${newRetryCount}/${maxRetries})...`, 'system', logFunction);
      
      const backoffTime = Math.min(1000 * Math.pow(2, newRetryCount), 30000);
      
      // Schedule retry with backoff
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(createSendFunction(message, { 
            ...options, 
            maxRetries,
            retryCount: newRetryCount 
          })());
        }, backoffTime);
      });
    }
    
    Logger.log('Not connected or not ready', 'system', logFunction);
    return Promise.resolve(false);
  }
  
  // Main connect function
  function connect(options = {}) {
    const logFunction = options.logFunction || console.log;
    
    if (isConnectionActive()) {
      Logger.log('Connection already established or in progress', 'system', logFunction);
      return Promise.resolve(false);
    }
    
    return new Promise((resolve, reject) => {
      setupSocket(options, resolve, reject);
    });
  }
  
  // Disconnect function
  function disconnect(options = {}) {
    const logFunction = options.logFunction || console.log;
    
    if (!socket) {
      Logger.log('Not connected, nothing to disconnect', 'system', logFunction);
      return Promise.resolve(false);
    }
    
    return new Promise((resolve) => {
      try {
        const code = options.code || 1000;
        const reason = options.reason || 'Client initiated disconnect';
        const timeout = options.timeout || 5000;
        
        // Set up cleanup timeout
        const closeTimeout = setTimeout(() => {
          Logger.log('Forced disconnect resolution after timeout', 'system', logFunction);
          socket = null;
          resolve(true);
        }, timeout);
        
        // Define clean close handler
        const onCloseHandler = (event) => {
          clearTimeout(closeTimeout);
          CallbackHandler.execute(options.onClose, event, logFunction);
          resolve(true);
        };
        
        socket.onclose = onCloseHandler;
        socket.close(code, reason);
      } catch (error) {
        Logger.log(`Failed to disconnect: ${error.message}`, 'system', logFunction);
        socket = null;
        resolve(false);
      }
    });
  }
  
  // Helper for connection status check
  function isConnectionActive() {
    return socket && (
      socket.readyState === CONNECTION_STATES.OPEN || 
      socket.readyState === CONNECTION_STATES.CONNECTING
    );
  }
  
  // Message sending entry point
  function sendMessage(message, options = {}) {
    const sendFn = createSendFunction(message, options);
    return sendFn();
  }
  
  // Connection status check
  function isConnected() {
    return socket !== null && socket.readyState === CONNECTION_STATES.OPEN;
  }
  
  // Get connection state details
  function getConnectionState() {
    if (!socket) {
      return { 
        connected: false, 
        state: STATE_NAMES[CONNECTION_STATES.CLOSED], 
        stateCode: CONNECTION_STATES.CLOSED 
      };
    }
    
    return {
      connected: socket.readyState === CONNECTION_STATES.OPEN,
      state: STATE_NAMES[socket.readyState] || 'UNKNOWN',
      stateCode: socket.readyState
    };
  }
  
  // Get socket instance
  function getSocket() {
    return socket;
  }
  
  // Public API
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