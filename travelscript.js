$(document).ready(function () {
buildHome();
});

let log_url = 'https://accounts.spotify.com/authorize?client_id=058d8c0bc3fd40bab5e2d2cf01fc8bc1&redirect_uri=file%3A%2F%2F%2FUsers%2Froanroan%2FDocuments%2F3rd%2520Year%2520-%25201st%2520Semester%2FCOMP%2520426%2FFinalProject%2Ftravel.html&scope=user-read-private%20user-read-email&response_type=token&state=123';

let api_base = 'http://comp426.cs.unc.edu:3001/';

let curr_air_id = 0;
function login() {
  window.location = log_url;
}

/*--------------------------------BUILD HOME--------------------------------*/


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

$('.good').on("click", function() {
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
buildTraveler();
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
  curr_air_id = airline_id;
  let body = $('body');
  body.empty();

  let chooseFlight = "<header>Select Your Flight</header>";
  body.append(chooseFlight);
  let divi = '<div id="currFlights"></div';
  body.append(divi);
  $.ajax(api_base + 'flights?filter[airline_id]='+airline_id,
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
      $('.flight').on("click", function() {
        let flight_id = $(this).attr("id");
        buildUpdateF(flight_id);
      });
    }
  });


  let or = '<h2>OR</h2><h3>Create a New Flight</h3>';
  let form = '<textarea id="departure_time" cols="40" rows="1" placeholder="Departure Time"></textarea><br><textarea id="arrival_time" cols="40" rows="1" placeholder="Arrival Time"></textarea><br><textarea id="Airinfo" cols="40" rows="2" placeholder="Number"></textarea><br>';
  let destination_div = '<div class="aircont departure"></div>';
  let arrival_div = '<div class="aircont arrival"></div>';

  let departure_header = '<h1 class="depart_head">Departing Airport</h1>';
  let arrival_header = '<h1 class="arrival_head">Arriving Airport</h1>';

  body.append(or);
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
    let airportdiv = '<div class="airport" id=' + airport.id + '>' + airport.name +'</div>';
    return airportdiv;
  }
  let but = '<button type="button" class="newFlight_btn" onclick="postFlight()">Create</button>';
  let divii = '<div id="createFlight">'+ form+but +'</div>';
  body.append(divii);
}

let create_curr_flight = (flight) => {
  let depart_time = flight.departs_at.slice(11,16);
  let arrive_time = flight.arrives_at.slice(11,16);
  let flightdiv = $('<div class="flight" id="'+ flight.id + '"></div>');
  flightdiv.append('<p class="dep_id">' + "id: " + flight.id + '</p>');
  flightdiv.append('<p class="dep_time" id="'+ depart_time + '">' + "Departure time: " + depart_time + '</p>');
  flightdiv.append('<p class="arr_time" id ="'+ arrive_time +'">' +  "Arrival time: " + arrive_time + '</p>');
  flightdiv.append('<p class="number">' + "Number: " + flight.number + '</p>');

  return flightdiv;
}

function postFlight() {
  let selected_ports = document.getElementsByClassName('selected');
  let departID = selected_ports[0].id;
  let arriveID = selected_ports[1].id;

  let departT = $('#departure_time').val();
  let arriveT = $('#arrival_time').val();
  let flnum = $('#Airinfo').val();


  $.ajax(api_base + 'flights',
    {
      type: 'POST',
      dataType: 'json',
      data: {
        "flight": {
                "departs_at": departT,
                "arrives_at": arriveT,
                "number": flnum,
                "departure_id": departID,
                "arrival_id": arriveID,
                "airline_id": curr_air_id
              }
      },
      xhrFields: {withCredentials: true},
      success: (response) => {
        buildFlight(curr_air_id);
        }
    });
}


/*--------------------------------BUILD FLIGHT UPDATE PAGE--------------------------------*/
let curr_fl_id = '';
function buildUpdateF(flight_id) {
  curr_fl_id = flight_id;
  let body = $('body');
  body.empty();

  let updateFlight = "<header>Update Flight Details</header>";
  body.append(updateFlight);
  let divi = '<div id="currFlight"></div';
  body.append(divi);

  $.ajax(api_base + 'flights/'+flight_id,
    {
  type: 'GET',
  dataType: 'json',
  xhrFields: {withCredentials: true},
  success: (response) => {
      let flightdiv = create_up_flight(response);
      $('#currFlight').append(flightdiv);

      let texts = '<br><br><br><textarea class="update" id="up_dep" cols="40" rows="1" placeholder="Update Departure Time"></textarea><br><br>';
      texts += '<textarea class="update" id="up_ar" cols="40" rows="1" placeholder="Update Arrival Time"></textarea><br><br>';
      texts += '<textarea class="update" id="up_num" cols="40" rows="1" placeholder="Update Flight Number"></textarea><br><br>';
      texts += '<textarea class="update" id="up_pid" cols="40" rows="1" placeholder="Update Plane ID"></textarea><br><br>';
      texts += '<textarea class="update" id="up_inf" cols="40" rows="1" placeholder="Update Info"></textarea>';
      let update = '<div class="update_contain">'+ texts +'</div>';

      $('#currFlight').append(update);

      $('#up_dep').on('keyup', function(){
            $('.single.dep_time').text($('#up_dep').val());
        });
      $('#up_ar').on('keyup', function(){
            $('.single.arr_time').text($('#up_ar').val());
        });
      $('#up_num').on('keyup', function(){
            $('.single.number').text($('#up_num').val());
        });
      $('#up_pid').on('keyup', function(){
            $('.single.plane_id').text($('#up_pid').val());
        });
      $('#up_inf').on('keyup', function(){
            $('.single.info').text($('#up_inf').val());
        });

      let ref_cont = '<div class="ref_cont"></div>';
      $('#currFlight').append(ref_cont);

      $.ajax(api_base + 'planes',
        {
          type: 'GET',
          dataType: 'json',
          xhrFields: {withCredentials: true},
          success: (response) => {
              let mk_plane = '<div class="plane_up"><h1>Plane ID Reference</h1></div>';
              $('.ref_cont').append(mk_plane);
              let planes_array = response;
              for (let i =0; i < planes_array.length; i++) {
                let planediv = create_plane(planes_array[i]);
                $('.plane_up').append(planediv);
                $('.plane_up').append('<br>');
              }
              let text = '<textarea class="plane" id="nw_name" cols="40" rows="1" placeholder="Plane Name"></textarea>';
              text += '<textarea class="plane" id="nw_info" cols="40" rows="1" placeholder="Plane Info"></textarea><br>';
              text+= '<button type="button" class="newPla_btn" onclick="postPlane()">Create</button>'
              let new_plane = '<div class="plane_contain">'+ text +'</div>';
              $('.ref_cont').append('<header>Or</header>');
              $('.ref_cont').append(new_plane);
              let submit = '<button type="button" class="sub_btn" onclick="pushUpdate()">Submit All Updates</button>';
              $('.ref_cont').append(submit);

            }
        });

    }
  });


}

function create_plane (plane) {
  let planediv = $('<div class="planeDeets" id="'+ plane.id + '"></div>');
  planediv.append('<label>'+plane.name+' </label><br><p id="'+plane.id+'">ID: '+plane.id+'</p>');
  return planediv;
}

function pushUpdate() {
  let depat = $('.single.dep_time').html();
  let arat = $('.single.arr_time').html();
  let num = $('.single.number').html();
  let plid = $('.single.plane_id').html();
  let inf = $('.single.info').html();
  $.ajax(api_base + 'flights/'+curr_fl_id,
    {
      type: 'PUT',
      dataType: 'json',
      data: {
        "flight": {
                "departs_at": depat,
                "arrives_at": arat,
                "number": num,
                "plane_id": plid,
                "info": inf
                  }
      },
      xhrFields: {withCredentials: true},
      success: (response) => {
        buildUpdateF(curr_fl_id);
        }
    });

}

function postPlane() {
  let name = document.getElementById('nw_name').value;
  let info = document.getElementById('nw_info').value;

  $.ajax(api_base + 'planes',
    {
      type: 'POST',
      dataType: 'json',
      data: {
        "plane": {
                "name": name,
                "info": info
              }
      },
      xhrFields: {withCredentials: true},
      success: (response) => {
        buildUpdateF(curr_fl_id);
        }
    });
}

let create_up_flight = (flight) => {
  let depart_time = flight.departs_at.slice(11,16);
  let arrive_time = flight.arrives_at.slice(11,16);
  let flightdiv = $('<div class="flightDeets" id="'+ flight.id + '"></div>');
  flightdiv.append('<label>id: </label><p class="single dep_id">'+ flight.id + '</p><br>');
  flightdiv.append('<label>Departure time: </label><p class="single dep_time" id="'+ depart_time + '">' +depart_time + '</p><br>');
  flightdiv.append('<label>Arrival time: </label><p class="single arr_time" id ="'+ arrive_time +'">'+ arrive_time + '</p><br>');
  flightdiv.append('<label>Number: </label><p class="single number">'+ flight.number + '</p><br>');
  if (flight.plane_id == null || flight.plane_id === "") {
    flightdiv.append('<label>Plane Id: </label><p class="single plane_id">None</p><br>');
  } else {
    flightdiv.append('<label>Plane Id: </label><p class="single plane_id">'+ flight.plane_id +'</p><br>');
  }
  if (flight.info == null || flight.info === "") {
    flightdiv.append('<label>Info: </label><p class="single info">None</p>');
  } else {
    flightdiv.append('<label>Info: </label><p class="single info">'+ flight.info +'</p>');
  }

  return flightdiv;
}


/*--------------------------------BUILD TRAVELER PAGE--------------------------------*/

function buildTraveler() {
  let body = $('body');
  body.empty();

  let chooseAir = "<header>Choose Your Origin and Destination</header>";
  let departure_div = '<div class="aircont departure"></div>';
  body.append(chooseAir);
  body.append(departure_div);
  let origin_id = '';
  let destination_id = '';
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
          }
          $('.airport').on("click", function() {
            if ($(this).hasClass("selected")) {
              $(this).removeClass("selected");
            } else {
              $(this).addClass("selected");
              $(this).addClass("origin");
              origin_id = $(this).attr("id");
              let arrival_div = '<div class="aircont arrival"></div>';
              body.append(arrival_div);
              body.append('</br>');
              $('body').append('<button type="button" class="searchFlight_btn">Search</button>');
              $('.searchFlight_btn').on("click", function() {
                buildFlightList(origin_id, destination_id);
              })
              $.ajax(api_base + 'airports',
                {
                  type: 'GET',
                  dataType: 'json',
                  xhrFields: {withCredentials: true},
                  success: (response) => {
                      let airports_array = response;
                      for (let i =0; i < airports_array.length; i++) {
                        let airportdiv = create_curr_airport(airports_array[i]);
                        if (airports_array[i].id == origin_id) {

                        } else {
                          $('.arrival').append(airportdiv);
                        }

                      }
                      $('.airport').on("click", function() {
                        if ($(this).hasClass("selected")) {
                          $(this).removeClass("selected");
                        } else {
                          $(this).addClass("selected");
                          destination_id = $(this).attr("id");
                        }
                      })
                    }

                });
            }
          })
        }
    });
    let create_curr_airport = (airport) => {
      let airportdiv = '<div class="airport" id=' + airport.id + '>' + airport.name +'</div>';
      return airportdiv;
    }
}
function buildFlightList(origin_id, destination_id) {
  let body = $('body');
  body.empty();
  let chooseFlight = "<header>List of Flights</header>";
  body.append(chooseFlight);
  $.ajax(api_base + 'flights?' + 'filter[departure_id]=' + origin_id + '&filter[arrival_id]=' + destination_id,
    {
  type: 'GET',
  dataType: 'json',
  xhrFields: {withCredentials: true},
  success: (response) => {
      let flights_array = response;
      if (flights_array.length == 0) {
        body.append('</br>');
        body.append('<header>Sorry, there are no flights matching your selected origin and destination</header>');
        body.append('</br>');
        body.append('<button type="button" class="return_to_search">Back to Search</button>');
        $('.return_to_search').on("click", function() {
          buildTraveler();
        })

      } else {
        let divi = '<div id="currFlights"></div';
        body.append(divi);
        for (let i =0; i < flights_array.length; i++) {
          let flightdiv = create_curr_flight(flights_array[i]);
          $('#currFlights').append(flightdiv);
        }
      }
    }
  });
  let create_curr_flight = (flight) => {
    let depart_time = flight.departs_at.slice(11,16);
    let arrive_time = flight.arrives_at.slice(11,16);
    let flightdiv = $('<div class="flight" id="'+ flight.id + '"></div>');
    flightdiv.append('<p class="dep_id">' + "id: " + flight.id + '</p>');
    flightdiv.append('<p class="dep_time" id="'+ depart_time + '">' + "Departure time: " + depart_time + '</p>');
    flightdiv.append('<p class="arr_time" id ="'+ arrive_time +'">' +  "Arrival time: " + arrive_time + '</p>');
    flightdiv.append('<p class="number">' + "Number: " + flight.number + '</p>');

    return flightdiv;
  }
}
