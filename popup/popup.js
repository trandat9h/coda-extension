function createPage(name, parentPageUrl, apiKey) {
  resolveIdByUrl(parentPageUrl, apiKey)
  .then(pageId => {
    createPageAPICall(name, pageId, apiKey)
    .then(data => {
      enableButton()
      console.log('API response:', data);
    })
    .catch(error => {
      console.error('API error:', error);
    })
  })
}

function renamePage(name, parentPageUrl, apiKey) {
resolveIdByUrl(parentPageUrl, apiKey)
.then(pageId => {
  renamePageAPICall(name, pageId, apiKey)
    .then(data => {
      enableButton()
      console.log('API response:', data);
    })
    .catch(error => {
      console.error('API error:', error);
    });
  })
}

async function renamePageAPICall(name, currentPageId, apiKey) {
  // API endpoint
  const apiUrl = `https://coda.io/apis/v1/docs/WriBKjdmAH/pages/${currentPageId}`;

  // Request payload
  const payload = {name: name};

  // Fetch options
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling Coda API:', error.message);
    throw error;
  }
}

async function createPageAPICall(name, parentPageId, apiKey) {
// API endpoint
const apiUrl = 'https://coda.io/apis/v1/docs/WriBKjdmAH/pages';

// Request payload
const payload = {
  name: name,
  parentPageId: parentPageId,
};

// Fetch options
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify(payload),
};

try {
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data;
} catch (error) {
  console.error('Error calling Coda API:', error.message);
  throw error;
}
}

function disableButton() {
var buttons = document.getElementsByClassName('custom-button')
for(var i = 0; i < buttons.length; i++) {
  let button = buttons[i]
  
  // Disable the button and show loading text
  button.disabled = true;
  button.innerHTML = 'Loading...';
}
}

function enableButton() {
var buttons = document.getElementsByClassName('custom-button')
for(var i = 0; i < buttons.length; i++) {
  let button = buttons[i]
  
  button.innerHTML = 'Finished';
  button.style.backgroundColor = '#2ecc71';
}
}

async function resolveIdByUrl(pageUrl, apiKey) {
  // API endpoint
  const apiUrl = 'https://coda.io/apis/v1/resolveBrowserLink';

  // Test
  // Define the query parameters
  const queryParams = {
    url: pageUrl,
  };

  // Create an array of key-value pairs for the query parameters
  const paramsArray = Object.entries(queryParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);

  // Concatenate the parameters into the URL
  // const urlWithParams = `${apiUrl}?${paramsArray.join('&')}`;
  const urlWithParams = `${apiUrl}?url=${pageUrl}`
  // End test

  // Fetch options
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
  };

  try {
    const response = await fetch(urlWithParams, options);

    if (!response.ok) {
      console.error(pageUrl)
      const errorMessage = await response.json()
      const str_error = JSON.stringify(errorMessage)
      throw new Error(`API request failed with status ${str_error}`);
    }

    const data = await response.json();
    return data["resource"]["id"];
  } catch (error) {
    console.error('Error calling Coda API:', error.message);
    throw error;
  }

}

document.addEventListener('DOMContentLoaded', () => {
// Allow tab switching
let tab1 = document.getElementById("tab1");
let tab2 = document.getElementById("tab2");
let content1 = document.getElementById("content1");
let content2 = document.getElementById("content2");

tab1.addEventListener("click", function() {
  content1.style.display = "block";
  content2.style.display = "none";
});

tab2.addEventListener("click", function() {
  content1.style.display = "none";
  content2.style.display = "block";
});

// Event handler for creating page button
const createPageButtonElement = document.getElementById('create-page');

createPageButtonElement.addEventListener('click', () => {
  disableButton()

  chrome.runtime.sendMessage({ action: 'getCurrentPageCanvasId' }, (response) => {
    let {parentPageUrl} = response 

    // Get input values
    var name = document.getElementById('name-1').value;
    console.log(name)
    var APIKey = document.getElementById('APIKey-1').value;

    createPage(name, parentPageUrl, APIKey)
  });
});

// Event handler for rename page button
const renameButtonElement = document.getElementById('rename-page')
renameButtonElement.addEventListener('click', () => {
  disableButton()

  chrome.runtime.sendMessage({ action: 'getCurrentPageCanvasId' }, (response) => {
    let {parentPageUrl} = response

    // Get input values
    var name = document.getElementById('name-2').value;
    console.log(name)
    var APIKey = document.getElementById('APIKey-2').value;

    renamePage(name, parentPageUrl, APIKey)
  });
});
});

