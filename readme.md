 # PETFINDERPLUGIN

Petfinder has transitioned away from their v1 API to a v2 API that uses OAUTH. This basic plugin will help you get started on your way to getting data from Petfinder and displaying it on your webpages.

# GETTING STARTED

1. Request a API license and secret from Petfinder by visiting https://www.petfinder.com/developers/

2. Open getpets.php and add your API Key, Secret and shelter ID

3. Add <script src="petfinderplugin.js"></script> to your webpage and adjust your path if necessary

4. Add a <div id="data"></div> to your webpage. You can use any ID name you choose, ensure you update the id when you initialize the plugin below.

5. Initizlize the plugin on your webpage with the following:
    <script>
        Petfinderplugin.init({
            shelterid: "...",
            petdisplay: 0, // 1 = one, 0 = all
            url: "getpets.php",
            id: "data"
        });
    </script>

6. Add <link rel="stylesheet" href="petfinderplugin.css"> the head of your webpage adn adjust your path if necessary:

# AUTHOR 

Shaun Nelson - [snndeveloper]
(https://github.com/snndeveloper)




