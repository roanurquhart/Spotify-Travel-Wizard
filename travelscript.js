$(document).ready(function () {
buildHome();
});

let log_url = 'https://accounts.spotify.com/authorize?client_id=058d8c0bc3fd40bab5e2d2cf01fc8bc1&redirect_uri=file%3A%2F%2F%2FUsers%2Froanroan%2FDocuments%2F3rd%2520Year%2520-%25201st%2520Semester%2FCOMP%2520426%2FFinalProject%2Ftravel.html&scope=user-read-private%20user-read-email&response_type=token&state=123';

let api_base = 'http://comp426.cs.unc.edu:3001/';

function login() {
  window.location = log_url;
}

/*--------------------------------Build HOME--------------------------------*/


function buildHome() {
  let spot_box = '<div class="spotify_container"><p class="spotify_text">Connect to Spotify</p><button type="button" class="spotify_ajax" onclick="login(); return false;">Connect</button></div>';
  let header = '<header class="page_head">The Sound of Travel<header>';
  let choose = '<p>Choose your destiny</p>';
  let choice_box = '<div id="choice_box"><p class="choices evil"><span id="evil">Air Travel Overlord</span></p><span>   </span><p class="choices good"><span id="good">Naive Vacationer</span></p></div>'

  let body = $('body');
  body.empty();

  body.append(header);
  body.append(choose);
  body.append(choice_box);

  $('.evil').on("click", function() {
    $.ajax(api_base + 'sessions',
      {
    type: 'POST',
    dataType: 'json',
    data: {
      'user': {
        'username': 'roanandwill',
        'password': 'ajaxonem'
      }
    },
    xhrFields: {withCredentials: true},
    success: (response) => {
    }
  });
  buildAirline();
});
}





/*--------------------------------BUILD AIRLINE PAGE--------------------------------*/


function buildAirline() {
  let body = $('body');
  body.empty();

  let chooseAir = "<header>Select Your Airline</header>";
  let divi = '<div class="contain" id="currAir"><h1>Choose an exisiting Airline</h1></div';
   let form = '<textarea id="Airname" cols="40" rows="1" placeholder="Airline Name (Required)"></textarea><br><textarea id="logoUrl" cols="40" rows="1" placeholder="Logo Url"></textarea><br><textarea id="Airinfo" cols="40" rows="2" placeholder="Airline Info"></textarea><br>';
  let but = '<button type="button" class="newAir_btn" onclick="postAirline()">Create</button>';
  let divii = '<div class="contain" id="creatAir"><h1>Create a new Airline</h1>'+ form+but +'</div>';
  body.append(chooseAir);
  body.append(divi);
  body.append('<header>OR</header>')
  body.append(divii);
  $.ajax(api_base + 'airlines',
    {
  type: 'GET',
  dataType: 'json',
  xhrFields: {withCredentials: true},
  success: (response) => {
      let airline_array = response;
      for (let i =0; i < airline_array.length; i++) {
        let airdiv = create_curr_airline_div(airline_array[i]);

        $('#currAir').append(airdiv);
        $('#currAir').append('<br>');
      }
      $('.airline').on("click", function() {
        let airline_id = $(this).attr("id");
        buildFlight(airline_id);

      });
    }
  });


  let create_curr_airline_div = (airline) => {
	  let airdiv = $('<div class="airline" id="'+ airline.id + '"></div>');
    airdiv.append('<div class="airline_name">' + airline.name + '</div>');
    console.log(airline.logo_url);
    if (airline.logo_url == null || airline.logo_url === "") {

    } else {
      airdiv.append('<img src=' + airline.logo_url + "></div>");
    }
    if (airline.info == null || airline.info === "") {

    } else {
      airdiv.append('<div class="air_info">' + airline.info + '</div>');
    }
	  return airdiv;
  }
}

function postAirline() {
  let name = document.getElementById('Airname').value;
  if (name==="") {
    alert("The airline name is required. Please try again.");
  }
  let logo = document.getElementById('logoUrl').value;
  let info = document.getElementById('Airinfo').value;
  $.ajax(api_base + 'airlines',
    {
      type: 'POST',
      dataType: 'json',
      data: {
        "airline": {
                "name": name,
                "logo_url": logo,
                "info": info
              }
      },
      xhrFields: {withCredentials: true},
      success: (response) => {
        }
    });
    document.getElementById('Airname').value = "";
    document.getElementById('logoUrl').value = "";
    document.getElementById('Airinfo').value = "";
    buildAirline();
}

/*--------------------------------BUILD FLIGHT PAGE--------------------------------*/

function buildFlight(airline_id) {
  let body = $('body');
  body.empty();

  let chooseFlight = "<header>Select Your Flight</header>";
  body.append(chooseFlight);
  let divi = '<div id="currFlights"></div';
  body.append(divi);
  $.ajax(api_base + 'flights',
    {
  type: 'GET',
  dataType: 'json',
  xhrFields: {withCredentials: true},
  success: (response) => {
      let flights_array = response;
      for (let i =0; i < flights_array.length; i++) {
        let flightdiv = create_curr_flight(flights_array[i]);
        $('#currFlights').append(flightdiv);
      }
    }
  });

  let create_curr_flight = (flight) => {
	  let flightdiv = $('<div class="flight" id="'+ flight.id + '"></div>');
    flightdiv.append('<div class="dep_id">' + "id: " + flight.id + '</div>');
    flightdiv.append('<div class="dep_time">' + "Departure time: " + flight.departs_at + '</div>');
    flightdiv.append('<div class="arr_time">' +  "Arrival time: " + flight.arrives_at + '</div>');
    flightdiv.append('<div class="number">' + "Number: " + flight.number + '</div>');

	  return flightdiv;
  }

  let form = '<textarea id="departure_time" cols="40" rows="1" placeholder="Departure Time"></textarea><br><textarea id="arrival_time" cols="40" rows="1" placeholder="Arrival Time"></textarea><br><textarea id="Airinfo" cols="40" rows="2" placeholder="Number"></textarea><br>';
  let destination_div = '<div class="aircont departure"></div>';
  let arrival_div = '<div class="aircont arrival"></div>';
  let departure_header = '<h1 class="depart_head">Departing Airport</h1>';
  let arrival_header = '<h1 class="arrival_head">Arriving Airport</h1>';
  body.append(destination_div);
  body.append(arrival_div);
  $(".aircont.departure").append(departure_header);
  $(".aircont.arrival").append(arrival_header);
  $.ajax(api_base + 'airports',
    {
      type: 'GET',
      dataType: 'json',
      xhrFields: {withCredentials: true},
      success: (response) => {
          let airports_array = response;
          for (let i =0; i < airports_array.length; i++) {
            let airportdiv = create_curr_airport(airports_array[i]);
            $('.departure').append(airportdiv);
            $('.arrival').append(airportdiv);
          }
          $('.airport').on("click", function() {
            if ($(this).hasClass("selected")) {
              $(this).removeClass("selected");
            } else {
              $(this).addClass("selected");
            }
          })
        }

    });
  let create_curr_airport = (airport) => {
    let airportdiv = '<div class="airport" id=' + airport.id + '>' + airport.name + ' ' + airport.id + '</div>';
    return airportdiv;
  }
  let but = '<button type="button" class="newFlight_btn" onclick="postFlight()">Create</button>';
  let divii = '<div id="createFlight">'+ form+but +'</div>';
  body.append(divii);
}

function postFlight() {


}






/*--------------------------------BUILD TRAVELER PAGE--------------------------------*/
