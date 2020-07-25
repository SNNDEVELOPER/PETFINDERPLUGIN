<?php

    function getData() {
        // ADD YOUR ORGID, CLIENT ID AND SECRET BELOW
        $shelterID = "";
        $clientID = "";
        $clientSecret = "";

        // CURL REQUESTS FOR OAUTH TOKEN

        $curl = curl_init();
        $curl2 = curl_init();
        $url = "https://api.petfinder.com/v2/oauth2/token";
        
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => "grant_type=client_credentials&client_id=". $clientID . "&client_secret=" . $clientSecret,
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/x-www-form-urlencoded"
            ),
        ));

        $response = curl_exec($curl);
        $array = json_decode($response,true);
        $access_token = $array['access_token'];
        curl_close($curl);

        // CURL REQUEST FOR OAUTH BEARER TOKEN

        curl_setopt_array($curl2, array(
            CURLOPT_URL => "https://api.petfinder.com/v2/animals?organization=". $shelterID,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Authorization: Bearer " . $access_token . ""
            ),
        ));
        $response2 = curl_exec($curl2);
        curl_close($curl2);
        return $response2;
    };

    // WRITE TO FILE

    function get_content($file,$hours = 24,$fn = '',$fn_args = '') {
        $current_time = time(); 
        $expire_time = $hours * 60 * 60; 
        if (file_exists($file)) {
            $file_time = filemtime($file);
        }
        
        if(file_exists($file) && ($current_time - $expire_time < $file_time)) {
            // RETURN FROM CACHED FILE
            return file_get_contents($file);
        }
        else {
            $content = getData(); // GET NEW DATA
            if($fn) { 
                $content = $fn($content,$fn_args,$file);
            }
            file_put_contents($file,$content);
            return $content;
        }
    }

    /* utility function */
    function writeFile($content,$args,$file) {
        file_put_contents($file, $content);
        return $content;
    }

    $cached_pets_file_name = 'cached-pets.txt';
    $cached_pets = get_content($cached_pets_file_name,3,'writeFile',array('file'=>$cached_pets_file_name));
    //header("Access-Control-Allow-Origin: *"); CORS OPTION IF NEEDED

    $json = json_encode($cached_pets);
    printf($cached_pets);

?>