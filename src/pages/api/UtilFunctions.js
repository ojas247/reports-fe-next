import axios from 'axios';


const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
const PRIVATE_KEY = process.env.NEXT_PUBLIC_privateKeyForEncryption;

export function CreateUserId(email, password) {
    const reponse = fetch(`${backendAPI}/CreateUserId`, {
      method: 'POST', // or 'GET', 'PUT', etc.
      headers: {
        'Content-Type': 'application/json',
        // Additional headers if needed
      },
      body: JSON.stringify({ "username": email, "password": password }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the API response
        console.log(data);
      })
      .catch((error) => {
        // Handle errors
        console.error('Error:', error);
      });
  }

  export const pushGTMEvent = ({
    eventName,
    eventParams = {},
    userId,
    userProperties = {}
  }) => {
    window.dataLayer = window.dataLayer || [];
  
    const payload = {
      event: eventName,
      ...eventParams, // 👈 flatten eventParams to top level
    };
  
    if (userId) {
      payload.user_id = userId;
    }
  
    if (Object.keys(userProperties).length > 0) {
      payload.user_properties = userProperties;
    }
  
    window.dataLayer.push(payload);
  };
  

// encrypt password
export const encryptPassword = (password) => {
  if (!password || !PRIVATE_KEY) return '';
  
  let encrypted = '';
  for (let i = 0; i < password.length; i++) {
    // XOR each character with the corresponding character in the private key
    const keyChar = PRIVATE_KEY[i % PRIVATE_KEY.length];
    const charCode = password.charCodeAt(i) ^ keyChar.charCodeAt(0);
    encrypted += String.fromCharCode(charCode);
  }
  // Convert to hex string for safe transmission
  return Array.from(encrypted).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
};


// check authentication
export const checkAuthentication = async () => {
  try {
    const tokenString = sessionStorage.getItem("token");
    const token = JSON.parse(tokenString).value;
    // If no token, return false immediately
    if (!token) return false;
    
    const response = await axios.get(`${backendAPI}/AuthCheck`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });
    
    // Make sure to return the actual boolean value
    return response.data === true;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false; // Return false on error
  }
}

export function setSessionToken(token) {
  const expiryTime = new Date().getTime() + 30 * 60 * 1000; // 30 minutes from now
  const tokenData = {
    value: token,
    expiry: expiryTime,
  };
  sessionStorage.setItem("token", JSON.stringify(tokenData));
}

export function getSessionToken() {
  const tokenString = sessionStorage.getItem("token");
  if (!tokenString) return null;
  const tokenData = JSON.parse(tokenString);
  if (new Date().getTime() > tokenData.expiry) {
    sessionStorage.removeItem("token");
    return null;
  }
  return tokenData.value;
}

export function isSessionTokenValid() {
  const tokenString = sessionStorage.getItem("token");
  if (!tokenString) return false;

  const tokenData = JSON.parse(tokenString);
  if (new Date().getTime() > tokenData.expiry) {
    sessionStorage.removeItem("token");
    return false; // Token expired
  }
  return true; // Token is valid
}





