import React from "react";
// import { GoogleMap, LoadScript ,Marker} from '@react-google-maps/api';

// const containerStyle = {
//   width: '400px',
//   height: '400px'
// };

// const center = {
//   lat: -3.745,
//   lng: -38.523
// };

// function MyComponent() {
//   return (
//     <LoadScript
//       googleMapsApiKey="AIzaSyA66KwUrjxcFG5u0exynlJ45CrbrNe3hEc"
//     >
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={center}
//         zoom={10}
//       >
//         <Marker position={{ lat: -34.397, lng: 150.644 }} />
//         { /* Child components, such as markers, info windows, etc. */ }
//         <></>
//       </GoogleMap>
//     </LoadScript>
//   )
// }

// export default React.memo(MyComponent)

import { IconButton, Input } from "@mui/material";
import "./Map.css";
import SearchIcon from "@mui/icons-material/Search";
import {
  useJsApiLoader,
  GoogleMap,
  StandaloneSearchBox,
  Marker,
  LoadScript,
  Autocomplete,
  InfoWindow,
} from "@react-google-maps/api";
import { useRef, useState } from "react";

let coords = [];
const center = { lat: 48.8584, lng: 2.2945 };
let markerArray = [];
function Map({ handleLat, handleLng,latUpdate,lngUpdate }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBAzCAAy1W9UlnVaW8qABvEepsNlFS7rMc",
    libraries: ["places"],
  });
  const [lat, setLat] = useState(latUpdate);
  const [long, setLong] = useState(lngUpdate);
  const [map, setMap] = useState();
 
  const [name, setName] = useState("");
  const text = useRef();
  const [place, setPlace] = useState({
    center: { lat: -33.867, lng: 151.195 },
    coordsResult: [],
  });
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [bound, setBound] = useState();
 

  const onMapLoad = (map) => {
    navigator?.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        const pos = { lat, lng };
        setCurrentLocation(pos);
      }
    );
    window.google.maps.event.addListener(map, "bounds_changed", () => {
      console.log(map.getBounds());
      setBound(map.getBounds());
    });
  };

  const [center, setCenter] = useState({ lat: 10.83155922746235, lng: 106.66084968921815});
  // const [center, setCenter] = useState({ lat: lat==null?-33.867:latUpdate, lng: long==null? 151.195:lngUpdate });



  const [coordsResult, setCoordsResullt] = useState([]);
  async function onMapLoadName() {
    if (map == null) {
      return;
    }
    let request = {
      query: text.current.value,
      fields: ["name", "geometry"],
    };

    let service = new window.google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      
        console.log(results);
        setCenter(results[0].geometry.location);
        setLat(results[0].geometry.location.lat)
        setLong(results[0].geometry.location.lng)
        handleLat(results[0].geometry.location.lat);
        handleLng(results[0].geometry.location.lng);
     
      }
    });
  }

  return (
    <LoadScript
      googleMapsApiKey={"AIzaSyBAzCAAy1W9UlnVaW8qABvEepsNlFS7rMc"}
      libraries={["places"]}
    >
      <GoogleMap
        center={center}
        onClick={(ev) => {
          setLat(ev.latLng.lat());
          setLong(ev.latLng.lng());
          handleLat(ev.latLng.lat());
          handleLng(ev.latLng.lng());
        }}
        zoom={13}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={{
          fullscreenControl: true,
        }}
        // onLoad={map => onMapLoad(map)}
        // onLoad={(map) => onMapLoadName(map)}
        onLoad={(map) => setMap(map)}
      >
        <Autocomplete>
          <input
            type="text"
            placeholder="Nhập địa điểm"
            ref={text}
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `40px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "50%",
              marginLeft: "-120px",
              top: "2%",
            }}
          />
        </Autocomplete>
        <button
          style={{
            position: "absolute",
            left: "65%",
            padding: "2px 4px 1px",
            cursor: "pointer",
            border: 0,
            borderRadius:"50%",
            backgroundColor:"#00ab55",

           
            top: "3%",
          }}
          onClick={onMapLoadName}
        >
          <SearchIcon style={{color:"#fff"}}/>
        </button>
        <></>
        <Marker position={{ lat: lat, lng: long }} />
        
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(Map);

// import React from "react";

// import { GoogleMap, StandaloneSearchBox, Marker } from "@react-google-maps/api";

// let markerArray = [];
// class Place extends React.Component {
//   state = {
//     currentLocation: { lat: 0, lng: 0 },
//     markers: [],
//     bounds: null
//   };

//   onMapLoad = map => {
//     navigator?.geolocation.getCurrentPosition(
//       ({ coords: { latitude: lat, longitude: lng } }) => {
//         const pos = { lat, lng };
//         this.setState({ currentLocation: pos });
//       }
//     );
//     window.google.maps.event.addListener(map, "bounds_changed", () => {
//       console.log(map.getBounds());
//       this.setState({ bounds: map.getBounds() });
//     });
//   };

//   onSBLoad = ref => {
//     this.searchBox = ref;
//   };

//   onPlacesChanged = () => {
//     markerArray = [];
//     let results = this.searchBox.getPlaces();
//     for (let i = 0; i < results.length; i++) {
//       let place = results[i].geometry.location;
//       markerArray.push(place);
//     }
//     this.setState({ markers: markerArray });
//     console.log(markerArray);
//   };

//   render() {
//     return (
//       <div>
//         <div id="searchbox">
//           <StandaloneSearchBox
//             onLoad={this.onSBLoad}
//             onPlacesChanged={this.onPlacesChanged}
//             bounds={this.state.bounds}
//           >
//             <input
//               type="text"
//               placeholder="Customized your placeholder"
//               style={{
//                 boxSizing: `border-box`,
//                 border: `1px solid transparent`,
//                 width: `240px`,
//                 height: `32px`,
//                 padding: `0 12px`,
//                 borderRadius: `3px`,
//                 boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
//                 fontSize: `14px`,
//                 outline: `none`,
//                 textOverflow: `ellipses`,
//                 position: "absolute",
//                 left: "50%",
//                 marginLeft: "-120px"
//               }}
//             />
//           </StandaloneSearchBox>
//         </div>
//         <br />
//         <div>
//           <GoogleMap
//             center={this.state.currentLocation}
//             zoom={10}
//             onLoad={map => this.onMapLoad(map)}
//             mapContainerStyle={{ height: "400px", width: "800px" }}
//           >
//             {this.state.markers.map((mark, index) => (
//               <Marker key={index} position={mark} />
//             ))}
//           </GoogleMap>
//         </div>
//       </div>
//     );
//   }
// }

// export default Place;
