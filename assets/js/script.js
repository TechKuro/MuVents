

// $.ajax({
//     url: 'https://api.serpstack.com/search',
//     data: {
//       access_key: '0a86bae76af23e3c8a1414ff86d2d367',
//       query: 'mcdonalds'
//     },
//     dataType: 'json',
//     success: function(apiResponse) {
//       console.log("Total results:", apiResponse.search_information.total_results);
//       apiResponse.organic_results.map(function(result, number) {
//         console.log(number + 1 + ".", result.title);
//       });
//     }
//   });

const apiKey = 'r8DA5FmL3xv8O9dO4K6WpafEvzCNG3Fv';

$.ajax({
    method: "GET",
    url: `https://app.ticketmaster.com/discovery/v2/events.json?&size=3&apikey=${apiKey}&city=Leicester&locale=en-gb`,
    async: true,
    dataType: "json",
}).then(function (response) {
    console.log(response);

    for (let i = 0; i < 3; i++) {
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

        $('#event-row').append(`
            <div class="card" style="width: 500px;">
                <div class="row no-gutters">
                    <div class="col-sm-5">
                        <img class="card-img" src="${eventImage}" alt="Event Image">
                    </div>
                    <div class="col-sm-7">
                        <div class="card-body">
                            <h5 class="card-title">${eventName}</h5>
                            <p class="card-text">Date and Time: ${eventDate}, ${eventTime}</p>
                            <address>
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
        // $(`.eventImage${i + 1}`).attr("src", eventImage);
        // $(`.eventLink${i + 1}`).attr("href", ticketMasterURL);
        // let eventInfo = $(`<p class="text-center actName eventName">`).text(eventName);
        // $(`.events${i + 1}`).append(eventInfo);
    }


});
