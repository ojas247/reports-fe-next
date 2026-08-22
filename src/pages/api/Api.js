const backendAPI = process.env.NEXT_PUBLIC_backendAPI;

if (!backendAPI) {
  console.error(
    "NEXT_PUBLIC_backendAPI is not defined in environment variables"
  );
}

const buildBackendUrl = (urlSlug) => {
  if (!backendAPI) {
    throw new Error(
      "Backend API URL is not configured"
    );
  }

  const base = backendAPI.replace(/\/+$/, "");
  const path = String(urlSlug || "").replace(/^\/+/, "");

  return `${base}/${path}`;
};

export async function fetchDataFromGetApi(urlSlug) {
  try {
    if (!backendAPI) {
      throw new Error(
        "Backend API URL is not configured"
      );
    }

    if (urlSlug === "_ah/warmup") {
      console.log(
        "Skipping warmup endpoint call"
      );

      return {
        status: "skipped",
      };
    }

    const url = buildBackendUrl(urlSlug);

    console.log(
      "[GET API] Request:",
      url
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();

      console.error(
        "[GET API] Status:",
        response.status
      );

      console.error(
        "[GET API] StatusText:",
        response.statusText
      );

      console.error(
        "[GET API] Response:",
        text
      );

      throw new Error(
        `${response.status} ${response.statusText}\n${text}`
      );
    }

    const data = await response.json();

    console.log(
      "[GET API] Response:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      `[GET API] Error from ${urlSlug}:`,
      error
    );

    throw error;
  }
}

export async function fetchDataFromPostApi(
  requestBody,
  urlSlug
) {
  try {
    if (!backendAPI) {
      throw new Error(
        "Backend API URL is not configured"
      );
    }

    if (
      !requestBody ||
      Object.keys(requestBody).length === 0
    ) {
      console.warn(
        "Request body is empty for:",
        urlSlug
      );
    }

    let bodyToSend = requestBody;

    if (
      urlSlug === "getTSdata" &&
      !Array.isArray(requestBody)
    ) {
      bodyToSend = requestBody;
    }

    const url = buildBackendUrl(urlSlug);

    console.log(
      "[POST API] Request:",
      url
    );

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(bodyToSend),
    });

    if (!response.ok) {
      const text = await response.text();

      console.error(
        "[POST API] Status:",
        response.status
      );

      console.error(
        "[POST API] StatusText:",
        response.statusText
      );

      console.error(
        "[POST API] Response:",
        text
      );

      throw new Error(
        `Network response from ${url} was not ok: ${response.status}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(
      "Error posting data:",
      error
    );

    throw error;
  }
}

export async function fetchSetorSubOptions() {
  try {
    const url = buildBackendUrl(
      "CRUD/get/Sectors"
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Error fetching sector options:",
      error
    );

    throw error;
  }
}

export async function fetchAuthors() {
  try {
    const url = buildBackendUrl(
      "CRUD/get/Authors"
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.status}`
      );
    }

    const data = await response.json();

    console.log(
      "Authors fetched:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "Error fetching authors:",
      error
    );

    throw error;
  }
}

export async function fetchYears() {
  try {
    const url = buildBackendUrl(
      "CRUD/get/years"
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Error fetching years:",
      error
    );

    throw error;
  }
}

export async function fetchTags() {
  try {
    const url = buildBackendUrl(
      "CRUD/get/Tags"
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Network response was not ok: ${response.status}`
      );
    }

    const data = await response.json();

    console.log(
      "Tags fetched:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "Error fetching tags:",
      error
    );

    throw error;
  }
}

export async function fetchGranularity() {
  try {
    const url = buildBackendUrl(
      "CRUD/get/Granularity"
    );

    console.log(
      "[Granularity] Fetching:",
      url
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();

      console.error(
        "[Granularity] Status:",
        response.status
      );

      console.error(
        "[Granularity] Response:",
        text
      );

      throw new Error(
        `Failed to fetch Granularity: ${response.status}`
      );
    }

    const data = await response.json();

    console.log(
      "[Granularity] Data:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "Error fetching Granularity:",
      error
    );

    throw error;
  }
}

export async function fetchUnits() {
  try {
    const url = buildBackendUrl(
      "CRUD/get/Units"
    );

    console.log(
      "[Units] Fetching:",
      url
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();

      console.error(
        "[Units] Status:",
        response.status
      );

      console.error(
        "[Units] Response:",
        text
      );

      throw new Error(
        `Failed to fetch Units: ${response.status}`
      );
    }

    const data = await response.json();

    console.log(
      "[Units] Data:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "Error fetching Units:",
      error
    );

    throw error;
  }
}