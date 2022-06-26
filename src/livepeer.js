const api_key = 'e9af40f7-9dbf-42d5-807e-dca75b95898f'

const getUploadUrl = async () => {
  const response = await fetch("https://livepeer.studio/api/asset/request-upload", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api_key}`,
    },
    body: JSON.stringify({ name: 'Example name' })
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

const uploadVideo = async (requestUrl, uploadedVideo) => {
  
  const response = await fetch(requestUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${api_key}`,
    },
    body: uploadedVideo
  })
  return response.json()
}
export {getUploadUrl, uploadVideo};

// Upload file

// const axios = require("axios");

// Upload the file to the URL received from response json.

// const url = data.url.id

// axios
//   .put(`${url}`, {
//     headers: {
//       "Content-Type": "video/mp4",
//     },
//     data: "@$VIDEO_FILE_PATH",
//   })
//   .then((res) => {
//     console.log(JSON.stringify(res.data));
//   })
//   .catch((error) => console.log(error));

// Use Uppy to select file from computer
// npm install @uppy/react

// const uppy = new Uppy({
//   meta: { type: 'avatar' },
//   restrictions: { maxNumberOfFiles: 1 },
//   autoProceed: true,
// })

// uppy.use(Tus, { endpoint: '/upload' })

// uppy.on('complete', (result) => {
//   const urlp = result.successful[0].uploadURL
//   store.dispatch({
//     type: 'SET_USER_AVATAR_URL',
//     payload: { urlp },
//   })
// })

// const Upload = ({ currentAvatar }) => {
// return (
//   <div>
//     <img src={currentAvatar} alt="Current Avatar" />
//     <DragDrop
//       uppy={uppy}
//       locale={{
//         strings: {
//           // Text to show on the droppable area.
//           // `%{browse}` is replaced with a link that opens the system file selection dialog.
//           dropHereOr: 'Drop here or %{browse}',
//           // Used as the label for the link that opens the system file selection dialog.
//           browse: 'browse',
//         },
//       }}
//     />
//   </div>
// )
// }

// export default Upload;

// Uppy react callable components

{/* <Dashboard /> - renders an inline @uppy/dashboard */}
{/* <DashboardModal /> - renders a @uppy/dashboard modal */}
{/* <DragDrop /> - renders a @uppy/drag-drop area */}
{/* <ProgressBar /> - renders a @uppy/progress-bar */}
{/* <StatusBar /> - renders a @uppy/status-bar */}
