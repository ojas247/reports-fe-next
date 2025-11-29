import axios from 'axios';


const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
const PRIVATE_KEY = process.env.NEXT_PUBLIC_privateKeyForEncryption;

export function CreateUserId(email, password, phone) {
  const reponse = fetch(`${backendAPI}/CreateUserId`, {
    method: 'POST', // or 'GET', 'PUT', etc.
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "username": email, "password": password, "phone": phone }),
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

export function sleep_function(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


export function parseDDMMYYYY(str) {
  if (!str) return null;

  str = str.trim(); // remove spaces or invisible chars

  // 🧠 Case 1: DD-MM-YYYY
  if (str.split("-").length === 3) {
    const [part1, part2, part3] = str.split("-").map(x => parseInt(x, 10));

    // Detect whether the first part is day or year
    if (part1 > 31) {
      // Format: YYYY-MM-DD (ISO style)
      const [year, month, day] = [part1, part2, part3];
      if (!year || !month || !day) return null;
      return new Date(year, month - 1, day);
    } else {
      // Format: DD-MM-YYYY
      const [day, month, year] = [part1, part2, part3];
      if (!day || !month || !year) return null;
      return new Date(year, month - 1, day);
    }
  }

  // 🧠 Case 2: YYYY-MM (Year and Month only)
  if (str.split("-").length === 2) {
    const [year, month] = str.split("-").map(x => parseInt(x, 10));
    if (!year || !month) return null;
    // Default to 1st day of the month
    return new Date(year, month - 1, 1);
  }

  // ❌ Fallback: invalid or unknown format
  return null;
}



export function formatGridHeader(headers, granularity) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return headers.map((h, index) => {
    try {
      if (index === 0) return h; // keep first column as title

      // console.log("Input to DateParser: ", h);
      const date = parseDDMMYYYY(h);
      // console.log("Output from DateParser: ", date);
      if (isNaN(date)) return h; // fallback if parse fails

      const year = date.getFullYear().toString().slice(-2);
      const month = date.getMonth(); // 0 = Jan, 11 = Dec

      if (granularity === "Monthly") {
        return `${monthNames[month]} '${year}`;
      }

      if (granularity === "Financial QoQ") {
        // FY in India → Apr–Mar
        const fyYear = month >= 3 ? date.getFullYear() : date.getFullYear() - 1;
        const fyShort = fyYear.toString().slice(-2);

        let quarter;
        if (month >= 3 && month <= 5) quarter = "Q1"; // Apr–Jun
        else if (month >= 6 && month <= 8) quarter = "Q2"; // Jul–Sep
        else if (month >= 9 && month <= 11) quarter = "Q3"; // Oct–Dec
        else quarter = "Q4"; // Jan–Mar

        return `${quarter} '${fyShort}`;
      }

      if (granularity === "Financial YoY") {
        // const fyYear = month >= 3 ? date.getFullYear() : date.getFullYear() - 1;
        const fyYear =  date.getFullYear();
        return `FY${fyYear.toString().slice(-2)}`;
      }

      if (granularity === "Calendar Year") {
        const cyYear =  date.getFullYear();
        return `CY${cyYear.toString().slice(-2)}`;
      }
    }
    catch (error) {
      console.warn("Error formatting header:", h, error);
      return h; // fallback on any unexpected error
    }
  });
}






