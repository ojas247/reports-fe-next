
const backendAPI = process.env.NEXT_PUBLIC_backendAPI;


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
      try {
        // const response = await fetch(`${backendAPI}/UpdateEndpoint/sectorsOptions`, {
        const response = await fetch(`${backendAPI}/CRUD/get/Sectors`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        let data = await response.json();
        // console.log("response api.js:",data);
        return data;
      } catch (error) {
        console.error('Error:', error);
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

  export async function fetchYears() {   // // commmented on 3rd Aug 2025
    try {
      // const response = await fetch(`${backendAPI}/UpdateEndpoint/years`, {
      const response = await fetch(`${backendAPI}/CRUD/get/years`, {
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