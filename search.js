const fs = require('fs');
var request = require('request');
const path = require('path');
let axios = require('axios');
let pathName = path.join(__dirname, 'ImageDownloads')

const getGiphy = (term) => {
    try {
      return axios.get('https://api.giphy.com/v1/gifs/search?api_key=yhQpdmG9OCLIssVRlPCoxm3hDzVPrJM5&q=' + term +'&limit=10&offset=0&rating=PG-13&lang=en')
    } catch (error) {
      console.error(error)
    }
}
  
const loadSearchResult = async (term) => {
  getGiphy(term)
      .then(response => {
        console.log(response)
        let indx = (Math.floor(Math.random() * 10))
        console.log(indx)
        let url = response['data']['data'][indx]['images']['fixed_width']['url']
        let title = response['data']['data'][indx]['title']
        console.log(url)

        const parentDiv = document.getElementById('searchRes');
        const img = document.createElement("img");
        img.src = url;
        img.alt = "Giphy"
        img.classList.add("downloadImge");
        img.onclick = function() {
            //const stillImage = response['data']['data'][indx]['images']['480w_still']['url']
            request.get({url: url, encoding: 'binary'}, function(err, response, body){
 
                fileName = "giphy-download-" +  title +'.gif'
                let file = path.join(pathName, fileName)
                fs.writeFile(file, body, 'binary', function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                })
            });     
            
        };
        parentDiv.innerHTML = ''
        parentDiv.appendChild(img);
      })
      .catch(error => {
        console.log(error)
      })
}


const submitForm = (e) => {
    e.preventDefault()
    let input = document.getElementById("inp")
    loadSearchResult(input.value)
}

const form = document.getElementById("searchForm");
form.addEventListener("submit", submitForm, true);


console.log("TEST")