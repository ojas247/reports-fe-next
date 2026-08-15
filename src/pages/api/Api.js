const backendAPI = process.env.NEXT_PUBLIC_backendAPI;

// Validate backend API URL
if (!backendAPI) {
  console.error('NEXT_PUBLIC_backendAPI is not defined in environment variables');
}

export async function fetchDataFromGetApi(urlSlug) {
  try {
    if (!backendAPI) {
      throw new Error('Backend API URL is not configured');
    }

    // Skip warmup endpoint calls from client
    if (urlSlug === '_ah/warmup') {
      console.log('Skipping warmup endpoint call');
      return { status: 'skipped' };
    }

    const response = await fetch(`${backendAPI}/${urlSlug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Status:", response.status);
      console.error("StatusText:", response.statusText);
      console.error("Response:", text);
      throw new Error(`${response.status} ${response.statusText}\n${text}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error from ${urlSlug}:`, error);
    throw error;
  }
}

export async function fetchDataFromPostApi(requestBody, urlSlug) {
  try {
    if (!backendAPI) {
      throw new Error('Backend API URL is not configured');
    }

    // Validate request body
    if (!requestBody || Object.keys(requestBody).length === 0) {
      console.warn('Request body is empty for:', urlSlug);
    }

    // Ensure request body is properly formatted for getTSdata
    let bodyToSend = requestBody;
    if (urlSlug === 'getTSdata' && !Array.isArray(requestBody)) {
      // If it's not an array, wrap it or send as is based on backend expectations
      bodyToSend = requestBody;
    }

    const response = await fetch(`${backendAPI}/${urlSlug}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyToSend),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Status:", response.status);
      console.error("StatusText:", response.statusText);
      console.error("Response:", text);
      throw new Error(`Network response from ${backendAPI}/${urlSlug} was not ok: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
}

export async function fetchSetorSubOptions() {
  try {
    if (!backendAPI) {
      throw new Error('Backend API URL is not configured');
    }

    const response = await fetch(`${backendAPI}/CRUD/get/Sectors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching sector options:', error);
    throw error;
  }
}

export async function fetchAuthors() {
  try {
    if (!backendAPI) {
      throw new Error('Backend API URL is not configured');
    }

    const response = await fetch(`${backendAPI}/CRUD/get/Authors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    let data = await response.json();
    console.log("Authors fetched:", data);
    return data;
  } catch (error) {
    console.error('Error fetching authors:', error);
    throw error;
  }
}

export async function fetchYears() {
  try {
    if (!backendAPI) {
      throw new Error('Backend API URL is not configured');
    }

    const response = await fetch(`${backendAPI}/CRUD/get/years`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching years:', error);
    throw error;
  }
}

export async function fetchTags() {
  try {
    if (!backendAPI) {
      throw new Error('Backend API URL is not configured');
    }

    const response = await fetch(`${backendAPI}/CRUD/get/Tags`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    let data = await response.json();
    console.log("Tags fetched:", data);
    return data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
}