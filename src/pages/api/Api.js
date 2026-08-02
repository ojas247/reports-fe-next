
const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
const USE_MOCK = true;

const mockData = {
  sectors: [
    {
      Sector: "Technology",
      SubSector: ["AI", "Cloud Computing", "Semiconductors"]
    },
    {
      Sector: "Healthcare",
      SubSector: ["Pharmaceuticals", "Medical Devices"]
    }
  ],

  authors: [
    { value: "John Doe", label: "John Doe" },
    { value: "Jane Smith", label: "Jane Smith" }
  ],

  years: [
    { value: "2026", label: "2026" },
    { value: "2025", label: "2025" }
  ],

  tags: [
    { value: "Market", label: "Market" },
    { value: "India", label: "India" },
    { value: "Economy", label: "Economy" }
  ]
};

export async function fetchDataFromGetApi(urlSlug) {
    try {
      const response = await fetch(`${backendAPI}/${urlSlug}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
       
      });
  
      if (!response.ok) {
        throw new Error(`Network response from ${backendAPI}/${urlSlug} was not ok`);
      }
      const data = await response.json();
     // console.log("response api.js:",data);
      return data;
    } catch (error) {
      console.error(`Error from ${urlSlug}:`, error);
      throw error;
    }
  }

 export async function fetchDataFromPostApi(requestBody, urlSlug) {
    try {
      const response = await fetch(`${backendAPI}/${urlSlug}`, {
    method: "POST",
    headers: {
          'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
        throw new Error(`Network response from ${backendAPI}/${urlSlug} was not ok`);
      }
      const data = await response.json();
      // console.log("response api.js:",data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
  }
}

    export async function fetchSetorSubOptions() {

  if (USE_MOCK) {
    return mockData.sectors;
  }

  try {
    const response = await fetch(`${backendAPI}/CRUD/get/Sectors`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();

  } catch (error) {
    console.error(error);
    throw error;
  }
}

  export async function fetchAuthors() {
    try {
      const response = await fetch(`${backendAPI}/CRUD/get/Authors`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
       
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      let data = await response.json();
      console.log("response api.js:",data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

 export async function fetchYears() {

  if (USE_MOCK) {
    return mockData.years;
  }

  try {
    const response = await fetch(`${backendAPI}/CRUD/get/years`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();

  } catch (error) {
    console.error(error);
    throw error;
  }
}

  export async function fetchTags() {
    try {
      const response = await fetch(`${backendAPI}/CRUD/get/Tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
       
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      let data = await response.json();
      console.log("response api.js:",data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }