let Petfinderplugin = (function (window, document) {

    let Plugin = {};

    //-------------------------------------------------------------------------------------//
    // CONSTRUCTOR ------------------------------------------------------------------------//
    //-------------------------------------------------------------------------------------//

    Plugin = (function () {
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

    Plugin.prototype.init = function (settings) {
        let _ = this;
        _.options = _._extend(_.defaults, settings);
        _._getData();
        return _;
    }

    //-------------------------------------------------------------------------------------//
    // PRIVATE METHODS --------------------------------------------------------------------//
    //-------------------------------------------------------------------------------------//
    let getId = function (id) {
        return document.getElementById(id)
    }
    let currentPage = window.location.pathname.split("/").pop();

    // UTILITY FUNCTION TO EXTEND OPTIONS
    Plugin.prototype._extend = function (source, obj) {
        Object.keys(obj).forEach(function (key) {
            source[key] = obj[key];
        });
        return source;
    };

    Plugin.prototype._getData = function () {
        let _ = this; // _.options.url
        let display = getId(_.options.id);
        fetch(_.options.url)
            .then(function (response) {
                response.status = 200 ? display.innerHTML = "Loading..." : '';
                return response.json();
            }).then(function (data) {
                _._listPets(data);
            })
            .catch(function (err) {
                console.log("Something went wrong with the request!", err);
                display.innerHTML = `We've experienced a technical problem. For our available adoptions please <a href="https://www.petfinder.com/search/pets-for-adoption/?shelter_id=${_.options.shelterid}">visit our Petfinder page</a>.`;
            });
    }

    Plugin.prototype._listPets = function (data) {
        let _ = this;
        let display = getId(_.options.id);
        display.innerHTML = "";
        let d = data;
        d = JSON.parse(JSON.stringify(d).replace(/\:null/gi, "\:\"\"")); 
        let pet = d.animals;
        let details = ``;
        let petContainer = `<div class="petCards">`;
        // NO ADOPTIONS
        if (Object.keys(pet).length === 0 && pet.constructor === Object) {
            details += `<div>No adoptions are available currently</div>`
        }
        // SHOW ONE RANDOM PET - WILL BE BUILT UNDER LIST ALL PETS
        if (_.options.petdisplay === 1 && !parseInt(getUrlParameter("petID"))) {
            pet = [pet[Math.floor(Math.random() * pet.length)]];
        }

        // PET DETAILS PAGE
        if (getUrlParameter("petID")) {
            pet = [pet.find(el => el.id === parseInt(getUrlParameter("petID")))];
            for (let i = 0; i < pet.length; i++) {
                details += ` 
                            
                            <div class="petCardFull">
                               
                                <h1>Hi, I'm ${pet[i].name}, nice to meet you!</h1>

                                <div class="petRow">

                                    <div class="petRight">
                                        
                                        <div class="petCard-content">
                                            <p>${pet[i].description}</p>
                                            
                                            <div class="petButtons">
                                                <p><a href="${pet[i].url}">Adopt ${pet[i].name}</a></p>
                                                <p> <a href = "${window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1).replace(/[\#\?].*$/,'') }">See more pets</a></p >
                                            </div>

                                        </div>

                                    </div>


                                    <div class="petLeft">
                                        <div class="petImageGallery">

                                            <div class="petMainImage">
                                                <img src="${pet[i].photos[0].medium}" id="petMainImage">
                                            </div>

                                            <div class="petThumbs">
                                                ${buildThumbnails(pet[i].photos)}
                                            </div>

                                        </div>
                                    </div>

                                </div>

                            </div>`;
            }
        } else {
            // LIST ALL PETS
            for (let i = 0; i < pet.length; i++) {
                details += `<div class="petCard">
                    <h1>${pet[i].name}</h1>
                    <p>${pet[i].age} - ${pet[i].size} - ${pet[i].breeds.primary} - ${pet[i].gender}</p>
                    <p><img src="${pet[i].photos[0].small}"></p>
                    <div class="petCard-content">
                        <p>${_._stringLength(pet[i].description, 100)} ...</p>
                    </div>
                    <!-- <p><a href="${pet[i].url}">Learn more</a></p> -->
                    <p><a href="${"?petID=" + pet[i].id}">Learn more</a></p>
                    
                </div>`;
            }

        }

        display.innerHTML = petContainer += details;

        // CLICK HANDLER FOR THUMBNAILS
        clickEvents()

    }

    Plugin.prototype._stringLength = function (yourString, maxLength) {
        let trimmedString = yourString.substr(0, maxLength);
        trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
        return trimmedString;
    }

    //-------------------------------------------------------------------------------------//
    // HELPER FUNCTIONS -------------------------------------------------------------------//
    //-------------------------------------------------------------------------------------//

    getClosest = (elem, selector) => {
        for (; elem && elem !== document; elem = elem.parentNode) {
            if (elem.matches(selector)) return elem;
        }
        return null;
    };

    getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
        let regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
            results = regex.exec(location.search)
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
    }

    getPageName = () => {
        let page = window.location.pathname.split("/").pop();
        return page;
    }

    buildThumbnails = (photos) => {
        let thumbnails = ``;
        for (let i = 0; i < photos.length; i++) {
            thumbnails += `<div class="thumbs">
                            <img src="${photos[i].small}" class="petThumbnail" data-fullsize="${photos[i].medium}">
                           </div>`
        }
        return thumbnails;
    }

    clickEvents = () => {
        let imgs = document.getElementsByClassName("petThumbnail");
        let petMainImage = document.getElementById("petMainImage")
        for (let j = 0; j < imgs.length; j++) {
            imgs[j].onclick = function (e) {
                petMainImage.src = e.target.dataset.fullsize
            }
        }
    }

    return new Plugin();

})(window, document);

(function () {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define('Petfinderplugin', function () {
            return Petfinderplugin;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Petfinderplugin;
    } else {
        window.Petfinderplugin = Petfinderplugin;
    }
})();