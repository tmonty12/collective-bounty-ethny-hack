const getUploadUrl = async (title) => {
  const response = await fetch("https://livepeer.studio/api/asset/request-upload", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_LIVEPEER_API_KEY}`,
    },
    body: JSON.stringify({ name: title })
  });
  const result = await response.json() // parses JSON response into native JavaScript objects
  return result
}

const uploadVideo = async (requestUrl, video) => {
  const response = await fetch(requestUrl, {
    method: 'PUT',
    headers: {
      'Content-Type':'video/mp4',
    },
    body: video
  })
  return response;
}

const retrieveAsset = async (assetId) => {
  const response = await fetch(`https://livepeer.studio/api/asset/${assetId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_LIVEPEER_API_KEY}`
    }
  })
  const result = await response.json()
  return result
}

const retrieveTasks = async () => {
  const response = await fetch(`https://livepeer.studio/api/task/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_LIVEPEER_API_KEY}`
    }
  })
  const result = await response.json()
  return result
}

export {getUploadUrl, uploadVideo, retrieveAsset, retrieveTasks};
