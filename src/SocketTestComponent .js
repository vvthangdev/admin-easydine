import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";

const SocketTestComponent = () => {
  const { user, socketInitialized } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    // Import getSocket dynamically to avoid import issues
    const getSocket = async () => {
      try {
        const { getSocket } = await import("./services/socket");
        const socketInstance = getSocket();
        setSocket(socketInstance);

        if (socketInstance) {
          setConnectionStatus(
            socketInstance.connected ? "Connected" : "Disconnected"
          );

          // Listen for connection events
          socketInstance.on("connect", () => {
            setConnectionStatus("Connected");
            addTestResult("Socket connected", "success");
          });

          socketInstance.on("disconnect", () => {
            setConnectionStatus("Disconnected");
            addTestResult("Socket disconnected", "warning");
          });

          // Listen for test responses
          socketInstance.on("pong", (data) => {
            addTestResult(`Pong received: ${data.message}`, "success");
          });

          socketInstance.on("connectionTest", (data) => {
            addTestResult(
              `Connection test response: ${data.message}`,
              "success"
            );
          });

          socketInstance.on("joinedAdminRoom", (data) => {
            addTestResult(`Joined admin room: ${data.room}`, "success");
          });

          socketInstance.on("joinedRoom", (data) => {
            addTestResult(`Joined room: ${data.room}`, "success");
          });

          // Listen for notifications to test
          socketInstance.on("newOrder", (data) => {
            addTestResult(
              `New order notification received: ${data.orderId}`,
              "info"
            );
          });

          socketInstance.on("orderStatusUpdate", (data) => {
            addTestResult(`Order status update: ${data.orderId}`, "info");
          });

          socketInstance.on("orderItemsUpdate", (data) => {
            addTestResult(`Order items update: ${data.orderId}`, "info");
          });
        }
      } catch (error) {
        console.error("Error getting socket:", error);
        addTestResult(`Error getting socket: ${error.message}`, "error");
      }
    };

    if (user && socketInitialized) {
      getSocket();
    }
  }, [user, socketInitialized]);

  const addTestResult = (message, type) => {
    const result = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    setTestResults(
      
      (prev) => [result, ...prev.slice(0, 19)]); // Keep last 20 results
  };

  const testPing = () => {
    if (socket && socket.connected) {
      socket.emit("ping", {
        message: "Test ping",
        timestamp: new Date().toISOString(),
      });
      addTestResult("Ping sent", "info");
    } else {
      addTestResult("Socket not connected", "error");
    }
  };

  const testConnection = () => {
    if (socket && socket.connected) {
      socket.emit("testConnection");
      addTestResult("Test connection sent", "info");
    } else {
      addTestResult("Socket not connected", "error");
    }
  };

  const testNewOrderAPI = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:8080/api/test-new-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
      });
      const result = await response.json();
      addTestResult(
        `API test result: ${result.message}`,
        response.ok ? "success" : "error"
      );
    } catch (error) {
      addTestResult(`API test error: ${error.message}`, "error");
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "Connected":
        return "text-green-600";
      case "Disconnected":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const getResultColor = (type) => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Socket Test</h3>
        <p className="text-red-600">Please login to test socket connection</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Socket Connection Test</h3>

      <div className="mb-4 space-y-2">
        <p>
          <strong>User:</strong> {user.username} ({user.role})
        </p>
        <p>
          <strong>Socket Initialized:</strong>{" "}
          {socketInitialized ? "Yes" : "No"}
        </p>
        <p>
          <strong>Connection Status:</strong>
          <span className={`ml-2 font-semibold ${getStatusColor()}`}>
            {connectionStatus}
          </span>
        </p>
        <p>
          <strong>Socket ID:</strong> {socket?.id || "N/A"}
        </p>
      </div>

      <div className="mb-4 space-x-2">
        <button
          onClick={testPing}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={!socket?.connected}
        >
          Test Ping
        </button>
        <button
          onClick={testConnection}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={!socket?.connected}
        >
          Test Connection
        </button>
        <button
          onClick={testNewOrderAPI}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Test New Order API
        </button>
        <button
          onClick={clearResults}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Results
        </button>
      </div>

      <div className="bg-gray-50 p-3 rounded">
        <h4 className="font-semibold mb-2">Test Results:</h4>
        <div className="max-h-60 overflow-y-auto space-y-1">
          {testResults.length === 0 ? (
            <p className="text-gray-500 italic">No test results yet...</p>
          ) : (
            testResults.map((result) => (
              <div key={result.id} className="text-sm">
                <span className="text-gray-400">{result.timestamp}</span>
                <span className={`ml-2 ${getResultColor(result.type)}`}>
                  {result.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SocketTestComponent;
