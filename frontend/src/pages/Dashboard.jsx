import React, { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";

import * as turf from "@turf/helpers";
import booleanContains from "@turf/boolean-contains";
import UserCard from "../components/UserCard";
import axios from "axios";

const Dashboard = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const draw = useRef(null);
    const [lng, setLng] = useState(77.02766);
    const [lat, setLat] = useState(28.507656);
    const [zoom, setZoom] = useState(15);

    const [polygon, setPolygon] = useState([[]]);

    const loc = [
        [77.03054099674944, 28.498323290639917],
        [77.03444629307529, 28.49922845487376],
        [77.03496127720587, 28.495928339492906],
        [77.0309916078644, 28.495456886014523],
        [77.03054099674944, 28.498323290639917],
    ];

    useEffect(() => {
        if (map.current) return; // Initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: loc[0],
            zoom: zoom,
        });

        // Current location
        map.current.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },

                // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true,

                // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true,
            })
        );

        const fetchPolygon = () => {
            try {
                map.current.on("load", async () => {
                    let res = await axios.get("/admin/current-session");
                    console.log(res.data.geoFencing);
                    map.current.addSource("geoFencing", {
                        type: "geojson",
                        data: {
                            type: "Feature",
                            geometry: {
                                type: "Polygon",
                                coordinates: [res.data.geoFencing[0]],
                            },
                        },
                    });

                    map.current.addLayer({
                        id: "geoFencing",
                        type: "fill",
                        source: "geoFencing", // reference the data source
                        layout: {},
                        paint: {
                            "fill-color": "#0080ff", // blue color fill
                            "fill-opacity": 0.5,
                        },
                    });
                });
            } catch (error) {
                console.log(error);
            }
        };

        fetchPolygon();
    });

    useEffect(() => {
        // Draw polygon programatically
    });

    const [update, setUpdate] = useState(true);
    useEffect(() => {
        const marker1 = new mapboxgl.Marker()
            .setLngLat([77.03681319426141, 28.541174130993329])
            .addTo(map.current);
    }, [update]);

    const poly = turf.polygon([loc]);
    const point = turf.point([77.03681319426141, 28.541174130993329]);

    // console.log(booleanContains(poly, point));

    return (
        <div>
            <div className="bg-slate-900 flex">
                <div className="user-card w-1/4 overflow-auto">
                    <UserCard />
                    <UserCard />
                    <UserCard />
                    <UserCard />
                    <UserCard />
                </div>
                <div
                    ref={mapContainer}
                    className="map-container-dashboard w-3/4 border-solid rounded border-4 border-blue-300 "
                />
            </div>
            <button
                onClick={() => {
                    console.log(polygon);
                }}
            >
                click
            </button>
        </div>
    );
};

export default Dashboard;
