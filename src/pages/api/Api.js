
import axios from 'axios';

const backendAPI = process.env.NEXT_PUBLIC_backendAPI;

if (!backendAPI) {
  console.error('NEXT_PUBLIC_backendAPI is not defined in environment variables');
}

const buildBackendUrl = (urlSlug) => {
  if (!backendAPI) {
    throw new Error('Backend API URL is not configured');
  }

  const base = backendAPI.replace(/\/+$/, '');
  const path = String(urlSlug || '').replace(/^\/+/, '');

  return `${base}/${path}`;
};

export const fetchCompanyIndicators = async (companySymbol) => {
  try {
    const response = await axios.post(
      `${backendAPI}/SearchCompanyIndicators`,
      {
        companySymbol
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching company indicators:', error);
    throw error;
  }
};

export const fetchIndicatorTimeSeries = async (params) => {
  try {
    const {
      dataName,
      dataItem,
      sector,
      subSector
    } = params;

    const response = await axios.post(
      `${backendAPI}/SearchIndicatorTS`,
      {
        dataName,
        dataItem,
        sector,
        subSector
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching indicator time series:', error);
    throw error;
  }
};

export const fetchIndicatorStockChart = async (params) => {
  try {
    const {
      dataName,
      dataItem,
      sector,
      subSector,
      company
    } = params;

    const response = await axios.post(
      `${backendAPI}/indicatorStockChart`,
      {
        dataName,
        dataItem,
        sector,
        subSector,
        company
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching indicator stock chart:', error);
    throw error;
  }
};

export const fetchLTP = async (symbol) => {
  try {
    const response = await axios.post(
      `${backendAPI}/getLTP`,
      {
        symbol
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching LTP:', error);
    throw error;
  }
};

export const fetchStockHistory = async (symbol, years = 5) => {
  try {
    const url = `${backendAPI}/historicStocksData?symbol=${encodeURIComponent(
      symbol
    )}&years=${years}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching stock history:', error);
    throw error;
  }
};

export async function fetchDataFromGetApi(urlSlug) {
  try {
    if (!backendAPI) {
      throw new Error('Backend API URL is not configured');
    }

    if (urlSlug === '_ah/warmup') {
      return {
        status: 'skipped'
      };
    }

    const url = buildBackendUrl(urlSlug);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`${response.status} ${response.statusText}\n${text}`);
    }

    return await response.json();
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

    const url = buildBackendUrl(urlSlug);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Network response from ${url} was not ok: ${response.status}\n${text}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
}

export async function fetchSetorSubOptions() {
  try {
    const url = buildBackendUrl('CRUD/get/Sectors');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
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
    const url = buildBackendUrl('CRUD/get/Authors');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching authors:', error);
    throw error;
  }
}

export async function fetchYears() {
  try {
    const url = buildBackendUrl('CRUD/get/years');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
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
    const url = buildBackendUrl('CRUD/get/Tags');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
}

export async function fetchGranularity() {
  try {
    const url = buildBackendUrl('CRUD/get/Granularity');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch Granularity: ${response.status}\n${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Granularity:', error);
    throw error;
  }
}

export async function fetchUnits() {
  try {
    const url = buildBackendUrl('CRUD/get/Units');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch Units: ${response.status}\n${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Units:', error);
    throw error;
  }
}
