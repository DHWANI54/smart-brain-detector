
let backendUrl = 'http://localhost:3000'; 


async function getApiBaseUrl() {
  try {
    const res = await fetch('http://localhost:3000/config');
    const data = await res.json();
    if (data.apiBaseUrl) {
      backendUrl = data.apiBaseUrl;
      console.log('Frontend connected to backend at:', backendUrl);
    }
  } catch (err) {
    console.log('Could not fetch backend URL, using default:', backendUrl);
  }
  return backendUrl;
}

export { getApiBaseUrl };
