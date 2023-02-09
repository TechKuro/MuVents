
const apiKey = 'r8DA5FmL3xv8O9dO4K6WpafEvzCNG3Fv';

$('#search-button').on('click', function (e) {
    e.preventDefault(); // prevent form from submitting and refreshing the page

    // Get the user input
    $('#event-row').empty();
    const userInput = $("#search").val();
    const userOption = $("#options").val();
    const userDate = $("#calendar").val();
    const size = 6;

    $.ajax({
        method: "GET",
        url: `https://app.ticketmaster.com/discovery/v2/events.json?&size=6&apikey=${apiKey}&keyword=${userInput}`,
        async: true,
        dataType: "json",
    }).then(function (response) {
        console.log(response);

        for (let i = 0; i < 6; i++) {
            const eventImage = response._embedded.events[i].images[1].url;
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
        
            <div class="card border-secondary mb-3" style="width: 540px;">
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img style="height: 100%;" class="card-img" src="${eventImage}" alt="Event Image">
                    </div>
                    <div class="col-md-8">
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
            
      `)
        }
    });
});

function getJoke() {
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
            $('body').append(card);
        },
        error: function () {
            console.error('Error retrieving joke');
        }
    });
}

$(document).ready(function () {
    getJoke();
});

