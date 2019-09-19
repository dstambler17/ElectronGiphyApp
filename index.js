const fs = require('fs');
const request = require('request');
let axios = require('axios');
const path = require('path');
let pathName = path.join(__dirname, 'giphyUploads')

const getGiphy = () => {
    try {
      return axios.get('https://api.giphy.com/v1/gifs/random?api_key=yhQpdmG9OCLIssVRlPCoxm3hDzVPrJM5&tag=&rating=PG-13')
    } catch (error) {
      console.error(error)
    }
}
  
const loadgiphy = async (id) => {
  getGiphy()
      .then(response => {
        console.log(response)
        let url = response['data']['data']['fixed_height_downsampled_url']
        console.log(url)

        const parentDiv = document.getElementById(id);
        const img = document.createElement("img");
        img.src = url;
        img.alt = "Giphy"
        parentDiv.appendChild(img);
      })
      .catch(error => {
        console.log(error)
      })
}
  
loadgiphy("left")
loadgiphy("center")
loadgiphy("right")


const submitFormUpload = (e) => {
  e.preventDefault()
  let input = document.getElementById("title-inp")
  let fileItem = document.getElementById("file-inp")
  let title = input.value
  let fileName = fileItem.value.split('fakepath\\')[1]
  let file = path.join(pathName, fileName)
  console.log(file)
    fs.readFile(file, function(err, data){
        if(err) {
            return console.log(err);
        }
        let postData = {
          api_key: 'yhQpdmG9OCLIssVRlPCoxm3hDzVPrJM5',
          file: {
            value: data,
            options: {
              filename: fileName,
              contentType: 'image/gif'
            }
          },
          tags: title + ', Webapp, Demo, myassistdemo',
          source_post_url: 'https://myassist.netlify.com/'
        }

        let params = {
          url: 'https://upload.giphy.com/v1/gifs?api_key=' + postData.api_key,
          formData: postData,
          json: true
        };
        request.post(params, function (e, resp, body){
          if (e || resp.statusCode !== 200){
            console.log('giphy upload failed: ' + e);
          }
          else{
            console.log("Success")
            console.log(body)
            input.value = ''
          }
        });
        console.log("The file was read!");
        console.log(data)
    })
}

const formUpload = document.getElementById("upload-form");
formUpload.addEventListener("submit", submitFormUpload, true);