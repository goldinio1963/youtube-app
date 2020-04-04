
let numpage = 0;
let next_token;
let prev_token;
let pervButton = document.querySelector('#pervPage');
let nextButton = document.querySelector('#nextPage');
const API_KEY = "AIzaSyD7jmiOLMPd7Dwo-o7D7P-qS_kirdXefx0";

function fetchVideos(searchTerm, page){

    if(numpage != 1) {
        pervButton.classList.remove('hidden')
        pervButton.classList.add('show');
    } else {
        pervButton.classList.remove('show')
        pervButton.classList.add('hidden');
    }
    
    let url = "";

    if(page == "none") {
        url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${searchTerm}
        &type=video&part=snippet&maxResults=10`;
    }
    if(page == "next") {
        url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${searchTerm}
        &type=video&part=snippet&maxResults=10&pageToken=${next_token}`;
    }
    if(page == "perv") {
        url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${searchTerm}
        &type=video&part=snippet&maxResults=10&pageToken=${prev_token}`;
    }
    


	let settings = {
		method : 'GET'
	};

	fetch(url, settings)
		.then(response => {
			if(response.ok){
				return response.json();
			}

		throw new Error(response.statusText);

	})
	.then(responseJSON => {
        if(page !== "perv"){
			numpage = numpage + 1;
		} else if (numpage > 1){
			numpage = numpage - 1;
		}
		displayResults(responseJSON);
	})
	.catch(err => {
		console.log(err);
    })
    
    

}

function displayResults( data ){
    let results = document.querySelector( '.results' );

    results.innerHTML = "";

    for(let i = 0; i < data.items.length; i++){
		results.innerHTML += `
			<div>
                <a href = "https://www.youtube.com/watch?v=${data.items[i].id.videoId}" target="_blank">
                    ${data.items[i].snippet.title}
                </a>
                <div>
                	<a href = "https://www.youtube.com/watch?v=${data.items[i].id.videoId}" target="_blank">
                    	<img src="${data.items[i].snippet.thumbnails.default.url}" />
                    </a>
                </div>
            </div>
        `;
    }
    next_token = data.nextPageToken;

	if(numpage != 1) {
		prev_token = data.prevPageToken;
    }
}

function watchForm(){
    let submitButtton = document.querySelector( '.submitButtton' );

    submitButtton.addEventListener( 'click', ( event ) => {
        event.preventDefault();
        searchTerm = document.querySelector( '#searchTerm' ).value;
        fetchVideos( searchTerm, "none" );
        searchTerm.value = "";
        numpage = 1;
    });

    pervButton.addEventListener( 'click', ( event ) => {
        event.preventDefault();
        fetchVideos( searchTerm, "perv" );

    });

    nextButton.addEventListener( 'click', ( event ) => {
        event.preventDefault();
        fetchVideos( searchTerm, "next" );
        
    });

    
}

function init(){
    watchForm();
}

init();