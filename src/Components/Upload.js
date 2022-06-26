// https://livepeer.studio/api/
//   "downloadUrl": "https://livepeercdn.com/asset/c20c1cuq37gzlns5/video"
// 16d0petgxq5od50q video id
import axios from 'axios'
import React from 'react'

// POST /api/asset/request-upload

const api_key = '79478b6f-3166-455e-b837-96f73c95e396';

const baseURL = "https://livepeer.studio/api/asset/import";
const uploadURL = "https://origin.livepeer.com/api/asset/upload/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcmVzaWduZWRVcmwiOiJodHRwczovL3N0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vbHAtdXMtdm9kLWNvbS9kaXJlY3RVcGxvYWQvMTZkMHBldGd4cTVvZDUwcS9zb3VyY2U_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ29udGVudC1TaGEyNTY9VU5TSUdORUQtUEFZTE9BRCZYLUFtei1DcmVkZW50aWFsPUdPT0cxRVlVTldOVjZSWUlLNTQySFdBM1JMN1JCN0pVT0VRM1lMMjNRWUI2Q0hQRzVITzJRQzMzTUpWVVklMkYyMDIyMDYyNiUyRnVzJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDIyMDYyNlQwMzI1MzFaJlgtQW16LUV4cGlyZXM9OTAwJlgtQW16LVNpZ25hdHVyZT0yYmU1ZWE1YTEzMzRmZjUxZjI4MDA0NDRiY2Y0NzIzZDVhZWVhZjAwMDhlNThjYTZmZTQxYjgzYjhlMWIwOWExJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZ4LWlkPVB1dE9iamVjdCIsImF1ZCI6Imh0dHBzOi8vbGl2ZXBlZXIuY29tIiwiaWF0IjoxNjU2MjEzOTMyfQ.0SDrtVogNkghxd7-XdJTq3IRMDFRwhA6OUs3tBqEQB0";

export default function App() {
  const [uploadFile, setUploadFile] = React.useState();
  const [superHero, setSuperHero] = React.useState();
  
  const submitForm = (event) => {
    event.preventDefault();

    const dataArray = new FormData();
    // dataArray.append("superHeroName", superHero);
    dataArray.append("file", uploadFile);

    fetch(uploadURL, {
      method: 'PUT',
      headers:{
      Authorization: `Bearer ${api_key}`,
      'Content-Type':'video/mp4'
      },
      body: uploadFile
    })
    .then((response) => {
      // successfully uploaded response
      console.log(response)
    })
    .catch((error) => {
      // error response
      console.log('failed')
    });
  }
}