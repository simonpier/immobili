/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

    storage: window.localStorage,
	
    initialize: function() {
        this.bind();
    },
     
    bind: function() {
 	document.addEventListener('deviceready', this.deviceready, false);
    $("#btnSalva").on("tap", function() {
  
		scheda.data.nome = $("#txtNome").val();
		scheda.data.indirizzo = $("#txtIndirizzo").val();
		scheda.data.descrizione = $("#txtDescrizione").val();
		scheda.data.prezzo = $("#txtPrezzo").val();
  
		scheda.save();
  
		navigator.notification.alert("Salvataggio effettuato!",function() {},"Informazione");
	});
			
	$("#btnInviaSchede").on("tap", function() {
	  
		if (app.isOnline()) {
	  
			navigator.notification.confirm(
	  
				"Confermi l'invio delle schede?",
	  
				function(buttonIndex) {
	  
					if (buttonIndex == 1) {
	  
						var listaSchede = [];
				  
						for (var i=0; i<app.storage.length; i++) {
				  
							scheda.load(app.storage.key(i));
							listaSchede.push(scheda.data);
						}
				  
						scheda.send(listaSchede,
				  
							function() {
				  
								navigator.notification.alert("Schede inviate!", function(){},"Informazione");
							},
				  
							function() {
				  
								navigator.notification.alert("Si è verificato un problema durante l'invio delle schede!", function(){},"Errore");
							});
					}
				},
	  
				"Conferma invio", 
				"Sì,No");
		} else {
	  
			navigator.notification.alert("Connessione Internet non disponibile!", function(){},"Informazione");
		}
	}); 
	$("#btnExit").on("tap", app.exit);
	$("#elencoSchede").on("pagebeforeshow",
         
        function(event) {
             
            var elencoSchede = $("#liElencoSchede");
            elencoSchede.html("");
             
            for (var i=0; i<app.storage.length; i++) {
                 
                var li = $("<li data-theme='c'> <a href='#' data-transition='slide'>" + app.storage.key(i) + "</a></li>");
				
				li.on("tap", function() {
         
					scheda.load($(this).text());
         
						$("#txtNome").val(scheda.data.nome);
						$("#txtIndirizzo").val(scheda.data.indirizzo);
						$("#txtDescrizione").val(scheda.data.descrizione);
						$("#txtPrezzo").val(scheda.data.prezzo);
						$.mobile.changePage($("#scheda"));
					});
					
				li.on("taphold", function() {
  
					var key = $(this).text();
     
					navigator.notification.confirm(
             
					"Confermi l'eliminazione della scheda?",
  
					function(buttonIndex) {
					if (buttonIndex == 1) {
							scheda.delete(key);
							$.mobile.changePage($("#elencoSchede"));
							}
					},
  
					"Conferma eliminazione",
  
					"Sì,No");
				});
				
                elencoSchede.append(li);
            }
             
            elencoSchede.listview("refresh");
        }
    );
},
     
	isOnline: function() {
         
        var networkState = navigator.connection.type;
         
        return ((networkState != Connection.NONE) && (networkState != Connection.UNKNOWN));
    },
	
    deviceready: function() {
        app.start();
    },
	
	
	
    start: function() {
     
        
    }
};
 
$(document).ready(function() {
    app.initialize();
});

var scheda = {
	
	data: {nome: "", indirizzo: "", descrizione: "", prezzo: "0,00"},
	
    save: function() {
       if (scheda.data.nome != "") {
			app.storage.setItem(scheda.data.nome, JSON.stringify(scheda.data));
        }
    },
	
	delete: function(nome) {
     
        if (nome != "") {
            app.storage.removeItem($.trim(nome));
        }
    },
	
	 load: function(nome) {
     
        if (nome != "") {
             
            var value = app.storage.getItem($.trim(nome));
            scheda.data = JSON.parse(value);
        }
		
    },
	
    send: function() {
        navigator.notification.confirm("Confermi l'invio delle schede?",
                                       scheda.confirmedSend,
                                       "Conferma invio",
                                       "Sì,No");
        },

    confirmedSend: function(buttonIndex) {
         
        if (buttonIndex == 1) { 
             
            //Istruzioni per l'invio
            navigator.notification.alert("Schede inviate!", function(){}, "Informazione");
        }
    },
	
	exit: function() {
 
    navigator.notification.confirm(
          "Vuoi uscire dall'applicazione?",
            function(buttonIndex) {
                 
                if (buttonIndex == 1) navigator.app.exitApp();
            },
            "Informazione",
            "Sì,No");
		},
}