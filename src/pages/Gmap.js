import React, { useEffect, useRef } from 'react';

const GMap = (posision) => {
  const googleMapRef = useRef(null);
  let googleMap = null;
  let geocoder;
  let infowindow;
  /* let response;
  let responseDiv; */

  useEffect(() => {
    //googleMap = initGoogleMap();
    initGoogleMap();
    //createMarker();



    /* window.google.maps.event.addListener(googleMap, "click", function (e) {
      //lat and lng is available in e object
      var latLng = e.latLng;
      console.log(latLng);
      addMarker(latLng);
    }); */
  }, []);


  // initialize the google map
  const initGoogleMap = () => {
    googleMap = new window.google.maps.Map(googleMapRef.current, {
      center: { lat: posision.lat, lng: posision.lng },
      zoom: 15,
      mapTypeControl: false,
      gestureHandling: "cooperative",
    });

    infowindow = new window.google.maps.InfoWindow({
      content:
        "<b><mark><u>Kinh độ</u>:</mark> " + posision.lat + ";\n" +
        "<mark><u>Vĩ độ</u>:</mark> " + posision.lng + "</b>"
    });
    const marker = new window.google.maps.Marker({
      position: { lat: posision.lat, lng: posision.lng },
      map: googleMap,
      title: "Uluru (Ayers Rock)",
    });

    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map: googleMap,
        shouldFocus: false,
      });
    });
    //

    geocoder = new window.google.maps.Geocoder();

    const inputText = document.createElement("input");

    inputText.type = "text";
    inputText.placeholder = "Nhập dịa chỉ";

    const submitButton = document.createElement("input");

    submitButton.type = "button";
    submitButton.value = "Tìm kiếm";
    submitButton.classList.add("button", "button-primary");

    const clearButton = document.createElement("input");

    clearButton.type = "button";
    clearButton.value = "Clear";
    clearButton.classList.add("button", "button-secondary");

   

    googleMap.controls[window.google.maps.ControlPosition.TOP_LEFT].push(inputText);
    googleMap.controls[window.google.maps.ControlPosition.TOP_LEFT].push(submitButton);
    googleMap.controls[window.google.maps.ControlPosition.TOP_LEFT].push(clearButton);
  
 
    googleMap.addListener("click", (e) => {
      geocode({ location: e.latLng });
    });
    submitButton.addEventListener("click", () =>
      geocode({ address: inputText.value })
    );
    clearButton.addEventListener("click", () => {
      clear();
    });

    //
    const geocode = (request) => {
      clear();
      geocoder
        .geocode(request)
        .then((result) => {
          const { results } = result;

          googleMap.setCenter(results[0].geometry.location);
          marker.setPosition(results[0].geometry.location);
          marker.setMap(googleMap);
          var latLng = JSON.parse(JSON.stringify(results[0].geometry.location, null, 2))
          console.log(latLng)
            infowindow.setContent(
            "<b><mark><u>Kinh độ</u>:</mark> " + latLng.lat + ";\n" +
            "<mark><u>Vĩ độ</u>:</mark> " + latLng.lng + "</b>");
          infowindow.open(googleMap, marker);

         
          return results;
        })
        .catch((e) => {
          alert("Geocode was not successful for the following reason: " + e);
        });
    }

    const clear = () => {
      marker.setMap(null);
      /* responseDiv.style.display = "none"; */
    }

  }

  // create marker on google map
  /* const createMarker = () => new window.google.maps.Marker({
    position: { lat: posision.lat, lng: posision.lng },
    map: googleMap
  }); */

  /* const addMarker = (location) => new window.google.maps.Marker({
    position: location,
    map: googleMap
  }); */

  //




  //


  return <div
    ref={googleMapRef}
    style={{ width: 1200, height: 500 }}
  //onClick={(t, googleMap, c) => addMarker(c.latLng, googleMap)}
  />
}

export default GMap;