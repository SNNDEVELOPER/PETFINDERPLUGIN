let Petfinderplugin = (function(window, document) {

    let Plugin = {};
    
    //-------------------------------------------------------------------------------------//
    // CONSTRUCTOR ------------------------------------------------------------------------//
    //-------------------------------------------------------------------------------------//
    
    Plugin = (function() {
        function Plugin() {
            let _ = this;
            _.defaults = {
                url: null
            };
        }
        return Plugin;
    }());
    
    //-------------------------------------------------------------------------------------//
    // PUBLIC METHODS ---------------------------------------------------------------------//
    //-------------------------------------------------------------------------------------//
    
    Plugin.prototype.init = function(settings) {
        let _ = this;
        _.options = _._extend(_.defaults,settings);
        _._getData();
        return _;
    }
    
    //-------------------------------------------------------------------------------------//
    // PRIVATE METHODS --------------------------------------------------------------------//
    //-------------------------------------------------------------------------------------//
    let getId = function(id) { return document.getElementById( id ) }

    // UTILITY FUNCTION TO EXTEND OPTIONS
    Plugin.prototype._extend = function(source, obj) {
        Object.keys(obj).forEach(function(key) {
          source[key] = obj[key];
        });
        return source;
    };
    
    Plugin.prototype._getData = function() {
        let _ = this; // _.options.url
        let display = getId(_.options.id);
        fetch('pets.php')
        .then(function (response) {
            response.status = 200 ? display.innerHTML = "Loading..." : '';
            return response.json();
        }).then(function (data) {
            _._listPets(data);
        })
        .catch(function (err) {
            console.log("Something went wrong with the request!", err);
            display.innerHTML = `We've experienced a technical problem. ${ _.options.shelterid ? `For our available adoptions please <a href="https://www.petfinder.com/search/pets-for-adoption/?shelter_id=${_.options.shelterid}">visit our Petfinder page</a>.` : ""}`;
        });
    }

    Plugin.prototype._listPets = function(data) {
        let _ = this;
        let display = getId(_.options.id);
        display.innerHTML = "";
        let d = data;
        let pet = d.animals;
        let details = ``;
        let petContainer = `<div class="petCards">`;
        // NO ADOPTIONS
        if(Object.keys(pet).length === 0 && pet.constructor === Object) {
            details += `<div>No adoptions are available currently</div>`
        } 
        // SHOW ONE RANDOM PET
        if(_.options.petdisplay === 1) {
            pet = [pet[Math.floor(Math.random()*pet.length)]];
        }
        
            // LIST
            for(let i = 0; i < pet.length; i++) {
                details += `<div class="petCard">
                    <h1>${pet[i].name}</h1>
                    <p>${pet[i].age} - ${pet[i].age}${pet[i].breeds.primary} - ${pet[i].gender}</p>
                    <div class="petCard-content">
                    <p>${_._stringLength(pet[i].description, 100)} ...</p>
                    </div>
                    <p><a href="${pet[i].url}">Learn more</a></p>
                    <p><img src="${pet[i].photos[0].small}"></p>
                </div>`;
            }
         
        display.innerHTML = petContainer += details;
    }

    Plugin.prototype._stringLength = function(yourString, maxLength) { 
        let trimmedString = yourString.substr(0, maxLength);
        trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
        return trimmedString;
    }
    
    return new Plugin();
    
})(window, document);
    
(function() {
    'use strict';
    if(typeof define === 'function' && define.amd) {
        define('Petfinderplugin', function () { return Petfinderplugin; });
    } else if(typeof module !== 'undefined' && module.exports) {
        module.exports = Petfinderplugin;
    } else {
        window.Petfinderplugin = Petfinderplugin;
    }
})();