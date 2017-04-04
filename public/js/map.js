$("document").ready(function() {


    var map = L.map('mapid');
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    }).addTo(map);

      $(".result").click(function(index) {
    
    var adresse = $(this).find(".localisation").text();
    $.post("/coord",{adresse}, function( data ) {
        if(data) {
            map.setView([data.lat, data.lon], 13); 
            L.marker([data.lat, data.lon]).addTo(map).bindPopup(adresse);
            $("#mapid").show();
        }
        else{
            $("#mapid").hide();
            console.log("erreur",data);
        }
    });

  });
    
})