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
			
	$("#btnInviaSchede").on("tap", scheda.send); 
	$("#btnExit").on("tap", app.exit);
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