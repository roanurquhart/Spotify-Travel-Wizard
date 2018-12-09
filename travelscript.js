$(document).ready(function () {
buildHome()
});

let log_url = 'https://accounts.spotify.com/authorize?client_id=058d8c0bc3fd40bab5e2d2cf01fc8bc1&redirect_uri=file%3A%2F%2F%2FUsers%2Froanroan%2FDocuments%2F3rd%2520Year%2520-%25201st%2520Semester%2FCOMP%2520426%2FFinalProject%2Ftravel.html&scope=user-read-private%20user-read-email&response_type=token&state=123';

let api_base = 'http://comp426.cs.unc.edu:3001/';

function login() {
  window.location = log_url;
}

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
    type: 'GET',
    dataType: 'json',
    data: {
      'user': {
        'username': 'roanandwill',
        'password': 'ajaxonem'
      }
    },
    xhrFields: {withCredentials: true},
    success: (response) => {
        alert('worked');
      }
    });
    buildAirline();
  })
}

function buildAirline() {
  let body = $('body');
  body.empty();

  let chooseAir = "<header>Select Your Airline</header>";
  let divi = '<div id="currAir"></div';
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
      }
    }
  });


  let create_curr_airline_div = (airline) => {
	  let airdiv = $('<div class="airline_name" id="'+ airline.name + '"></div>');
	  return airdiv;
  }


  let form = '<textarea id="Airname" cols="40" rows="1" placeholder="Airline Name"></textarea><br><textarea id="logoUrl" cols="40" rows="1" placeholder="Airline Name"></textarea><br><textarea id="Airinfo" cols="40" rows="2" placeholder="Airline Name"></textarea><br>';
  let but = '<button type="button" class="newAir_btn" onclick="postAirline">Create</button>';
  let divii = '<div id="creatAir">'+ form+but +'</div>';
  body.append(chooseAir);
  body.append(divi);
  body.append(divii);

}
