
const apiKey = 'r8DA5FmL3xv8O9dO4K6WpafEvzCNG3Fv';
// retreive history from local storage
let history = JSON.parse(localStorage.getItem('history')) || [];


function init(){
    renderHistoryTags();
    getJoke();
}

function clearContent(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

init();

function getEventData(url){
    $('.event-row').empty();
    $.ajax({
        method: "GET",
        url: url,
        async: true,
        dataType: "json",
    }).then(function (response) {
        console.log(response);

        for (let i = 0; i < 6; i++) {
            const eventImage = response._embedded.events[i].images[0].url;
            const eventName = response._embedded.events[i].name;
            const ticketMasterURL = response._embedded.events[i].url;
            const eventDate = response._embedded.events[i].dates.start.localDate;
            const eventTime = response._embedded.events[i].dates.start.localTime;
        
            const address_path = response._embedded.events[i]._embedded.venues[0];
            const venue_address = {
                name: address_path.name,
                address: address_path.address.line1,
                post_code: address_path.postalCode,
                city: address_path.city.name,
                country: address_path.country.name,
            }

            $('.event-row').append(`
            <div class="col-md-6 col-sm-12 mb-3">
                <div class="card border-secondary" style="max-width: 480px; height: 100%;">
                    <div class="row no-gutters">
                        <div class="col-sm-5">
                            <img style="height: 100%; object-fit:cover;" class="card-img" src="${eventImage}" alt="Event Image">
                        </div>
                        <div class="col-sm-7">
                            <div class="card-body">
                                <h5 class="card-title">${eventName}</h5>
                                <p class="card-text">Date and Time: ${eventDate}, ${eventTime}</p>
                                <address class="text-muted">
                                    Venue:<br>
                                    ${venue_address.name}<br>
                                    ${venue_address.address}<br>
                                    ${venue_address.post_code}<br>
                                    ${venue_address.city}, ${venue_address.country}
                                </address>
                                <a href="${ticketMasterURL}" target="_blank" class="btn btn-primary">Get Tickets</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      `)
       $('#pagination-div').empty();
       $('#pagination-div').append(`
       <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item ${response._links.first ?"" : "disabled"}"><a class="page-link" data-href="${response._links.first ? response._links.first.href : ""}" href="#">First</a></li>
            <li class="page-item ${response._links.prev ?"" : "disabled"}"><a class="page-link" data-href="${response._links.prev ? response._links.prev.href : ""}" href="#">Previous</a></li>
            <li class="page-item ${response._links.next ?"" : "disabled"}"><a class="page-link" data-href="${response._links.next ? response._links.next.href : ""}" href="#">Next</a></li>
            <li class="page-item ${response._links.last ?"" : "disabled"}"><a class="page-link" data-href="${response._links.last ? response._links.last.href : ""}" href="#">Last</a></li>
        </ul>
       </nav>
       `)
        }
    });
}
const clear = `<a href="#" id="clear" class="dropdown-item">Clear</a>`;
// $("#history").append(clear);

function renderHistoryTags() {
    $("#history").empty();
    // Loops through the array of history
    for (var i = 0; i < history.length; i++) {
        const search_history = $("<a>");
        search_history.addClass("dropdown-item history-item");
        search_history.attr("data-name", history[i]);
        search_history.text(history[i]);
        $("#history").append(search_history)
    }

    
}

$('#search-button').on('click', function (e) {
    e.preventDefault(); // prevent form from submitting and refreshing the page

    // Get the user input
    const userInput = $('#search').val().trim();
    if (userInput === ""){
        return;
    }else{
        if(!history.includes(userInput)){
            history.push(userInput);
            history.sort(function(element1, element2){
                return history.indexOf(element2) - history.indexOf(element1);
            })
            if(history.length > 5){
                history.pop();
            }
            localStorage.setItem('history', JSON.stringify(history));
        }
        getEventData(`https://app.ticketmaster.com/discovery/v2/events?classificationName=music&size=6&apikey=${apiKey}&keyword=${userInput}`); 
    }
    renderHistoryTags();
    getJoke();
});

$(document).on('click', '.page-link', function(e){
    e.preventDefault();
    const link_data = $(this).attr('data-href');
    getEventData(`https://app.ticketmaster.com${link_data}&apikey=${apiKey}`)
    getJoke()
})

$(document).on('click', '.history-item', function(e){
    e.preventDefault();
    const searchHistory = $(this).attr('data-name');
    getEventData(`https://app.ticketmaster.com/discovery/v2/events?classificationName=music&size=6&apikey=${apiKey}&keyword=${searchHistory}`);
    getJoke()
})

// $('#clear').on('click', function (e) {
//     e.preventDefault();
//     localStorage.removeItem('history');
//     history = [];
//     clearContent('history');
//     console.log(history);
//     $("#history").append(clear);
// })

function getJoke() {
    $('#chuck').empty();
    $.ajax({
        url: 'https://api.chucknorris.io/jokes/random',
        type: 'GET',
        success: function (response) {
            const card = `
          <div class="card text-center">
            <div class="card-body">
              <p class="card-text">${response.value}</p>
            </div>
          </div>
        `;
            $('#chuck').append(card);
        },
        error: function () {
            console.error('Error retrieving joke');
        }
    });
}
