$("document").ready(function() {

                     function doautocomplete(donnee){
                        console.log("autocomplete call");                            
                        console.log(donnee);
                        if(donnee){
                                $.map(donnee, function(objet){
                                    return objet; // on retourne cette forme de suggestion
                                });
                        }
                    }
/*
//Avec du Jsonp vers l'api gisgraphy, mais ne renvoit rien, incompréhensible, leur api a peut être un pb, ou alors c'est mon code
 $("#adresse-ko").keydown(function(event){ 

        if($(this).val() != undefined)
        {
            if ($(this).val().length > 1)
            {
                var ville = "";
                if ($("#ville").val())
                    ville = $("#ville").val()+",";
                var adresse = $("#adresse").val();
                $(this).autocomplete({
                    source : function(requete, reponse){ // les deux arguments représentent les données nécessaires au plugin


         //           $.getJSON("http://free.gisgraphy.com/fulltext/search?q="+adresse+"&allwordsrequired=false&radius=10000&suggest=true&style=MEDIUM&country=FR&lang=fr&from=1&to=10&indent=false&callback=?",function(json){
        //            console.log(json);
        //            });

                    $.ajax({
                            url : "http://free.gisgraphy.com/fulltext/search?q="+adresse+"&allwordsrequired=false&radius=10000&suggest=true&style=MEDIUM&country=FR&lang=fr&from=1&to=10&indent=false",
                            dataType : 'jsonp', // on spécifie bien que le type de données est en JSONP
                            //jsonp : false,
                            jsonpCallback : "doautocomplete"
                        });
                    }
                });
            }
        }
    
});
*/

$("#adresse").keydown(function(event){ 

        if($(this).val() != undefined)
        {
            if ($(this).val().length > 1)
            {
                var ville = "";
                if ($("#ville").val())
                    ville = $("#ville").val()+",";
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

/*
//Ajax vers server qui renvoit, mais pas optimal
$("#ville").keydown(function(event){ 

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
/*

    
    

})