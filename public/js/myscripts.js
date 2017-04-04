$("document").ready(function() {


 
 $("#adressex").keydown(function(event){ 

        if($(this).val() != undefined)
        {
            if ($(this).val().length > 1)
            {
                var ville = "";
                if ($("#ville").val())
                    ville = $("#ville").val()+",";
                console.log(ville);
                  $.post("/autocomplete",{ville,adresse : $(this).val()}, function( data ) {
                    if(data) {
                        console.log(data);
                    }
                  });
            }
            else{

            }
        }
    
});

$("#adresse").keydown(function(event){ 

        if($(this).val() != undefined)
        {
            if ($(this).val().length > 1)
            {
                $(this).autocomplete({
                    source : function(requete, reponse){ // les deux arguments représentent les données nécessaires au plugin
                    $.ajax({
                            url : '/autocomplete', // on appelle le script JSON
                            dataType : 'json', // on spécifie bien que le type de données est en JSON
                            data : {ville,adresse : $("#adresse").val()},
                            method : "POST",
                            fail :function() {
                                    alert( "error" );
                                },
                            success : function(donnee){
                                console.log(donnee);
                                reponse($.map(donnee, function(objet){
                                    return objet; // on retourne cette forme de suggestion
                                }));
                            }
                        });
                    }
                });


                var ville = "";
                if ($("#ville").val())
                    ville = $("#ville").val()+",";
                console.log(ville);
                  $.post("/autocomplete",{ville,adresse : $(this).val()}, function( data ) {
                    if(data) {
                        console.log(data);
                    }
                  });
            }
            else{

            }
        }
    
});

$("#ville").keydown(function(event){ 
        if($(this).val() != undefined)
        {
            if ($(this).val().length > 1)
            {
                $(this).autocomplete({
                    source : function(requete, reponse){ // les deux arguments représentent les données nécessaires au plugin
                    $.ajax({
                            url : 'http://ws.geonames.org/searchJSON', // on appelle le script JSON
                            dataType : 'json', // on spécifie bien que le type de données est en JSON
                            data : {
                                name_startsWith : $("#ville").val(), // on donne la chaîne de caractère tapée dans le champ de recherche
                                maxRows : 15,
                                username : "mat.lyon2006" 
                            },
                            fail :function() {
                                    alert( "error" );
                                },
                            success : function(donnee){
                                console.log(donnee);
                                reponse($.map(donnee.geonames, function(objet){
                                    return objet.name + ', ' + objet.countryName; // on retourne cette forme de suggestion
                                }));
                            }
                        });
                    }
                });
            }
        }
});

$("#villex").keydown(function(event){ 

        if($(this).val() != undefined)
        {
            if ($(this).val().length > 1)
            {
                var ville = $(this).val();
                  $.post("/autocomplete",{ville,adresse : null}, function( data ) {
                    if(data) {

                        
                            $(this).autocomplete({
                            source: data
                            });
                       
                        console.log(data);
                    }
                  });
            }
            else{

            }
        }
    
});


    
    

})