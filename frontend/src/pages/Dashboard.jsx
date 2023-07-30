import React, { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";

import * as turf from "@turf/helpers";
import booleanContains from "@turf/boolean-contains";
import UserCard from "../components/UserCard";
import axios from "axios";
import { notifyError, notifySuccess } from "../utils/toastify";

import moment from "moment";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useNavigate } from "react-router-dom";

const COLORS = {
    GREEN: "#07f847",
    RED: "#f80707",
    YELLOW: "#e8f807",
};

const Dashboard = () => {
    const navigate = useNavigate();

    const mapContainer = useRef(null);
    const map = useRef(null);
    const draw = useRef(null);
    const [lng, setLng] = useState(77.02766);
    const [lat, setLat] = useState(28.507656);
    const [zoom, setZoom] = useState(14);

    const [polygon, setPolygon] = useState([[]]);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [police, setPolice] = useState([]);

    const [currSession, setCurrSession] = useState({});

    let interval;

    useEffect(() => {
        if (map.current) return; // Initialize map only once

        const fetchPolygon = async () => {
            let res = {
                data: {
                    center: [77.03054099674944, 28.494323200639917],
                },
            };
            try {
                res = await axios.get("/admin/current-session");
                setPolice(res.data.police);
                setCurrSession(res.data);
            } catch (error) {
                notifyError(error.response.data.err);
                return;
            }

            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/streets-v12",
                center: res.data.center,
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
                })
            );

            map.current.on("load", async () => {
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

                setMapLoaded(true);

                interval = setInterval(() => {
                    axios.get("/admin/current-session").then((res) => {
                        console.log(res.data.police);
                        setPolice(res.data.police);
                    });
                }, 10000);
            });
        };

        fetchPolygon();
    });

    useEffect(() => {
        if (map.current && mapLoaded) {
            const poly = turf.polygon(currSession.geoFencing);

            for (let i = 0; i < police.length; ++i) {
                if (police[i].currLocation.length != 0) {
                    const popup = new mapboxgl.Popup({ offset: 25 }).setText(police[i].name);
                    const point = turf.point(police[i].currLocation);
                    const inside = booleanContains(poly, point);
                    new mapboxgl.Marker({ color: inside ? COLORS.GREEN : COLORS.RED })
                        .setLngLat(police[i].currLocation)
                        .setPopup(popup)
                        .addTo(map.current);
                }
            }

            return () => {
                clearInterval(interval);
            };
        }
    }, [police]);

    const terminateSession = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put("/admin/terminate-current-session");
            navigate("/create-bandobust");
            notifySuccess(res.data.message);
        } catch (error) {
            notifyError(error.response.data.err);
        }
    };

    return (
        <div className="bg-slate-900 ">
            <div className="relative min-h-screen md:flex" data-dev-hint="container">
                <input type="checkbox" id="menu-open" className="hidden" />

                <header
                    className="bg-gray-600 text-gray-100 flex justify-between md:hidden"
                    data-dev-hint="mobile menu bar"
                >
                    <a
                        href="#"
                        className="block p-6 text-white font-bold whitespace-nowrap truncate"
                    >
                        Officer's detail page
                    </a>

                    <label
                        for="menu-open"
                        id="mobile-menu-button"
                        className="m-2 p-2 mr-6 focus:outline-none hover:text-white hover:bg-gray-700 rounded-md"
                    >
                        <svg
                            id="menu-open-icon"
                            className="h-6 w-6 mr-0 transition duration-200 ease-in-out"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                        <svg
                            id="menu-close-icon"
                            className="h-6 w-6 transition duration-200 ease-in-out"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </label>
                </header>

                <aside
                    id="sidebar"
                    className="z-50 bg-gray-800 text-gray-100 md:w-1/4 w-5/6 space-y-6 pt-6 px-0 absolute inset-y-0 left-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out md:flex md:flex-col md:justify-between "
                    data-dev-hint="sidebar; px-0 for frameless; px-2 for visually inset the navigation"
                >
                    <div
                        className="flex flex-col space-y-6"
                        data-dev-hint="optional div for having an extra footer navigation"
                    >
                        <span className="mx-6 text-2xl font-extrabold whitespace-nowrap truncate">
                            Officer's details
                        </span>

                        <SimpleBar style={{ maxHeight: 700 }}>
                            <nav data-dev-hint="main navigation" className="user-card">
                                {police.map((p) => {
                                    return (
                                        <a
                                            key={p.policeUsername}
                                            href="#"
                                            className="flex items-center space-x-2 py-2 transition duration-200 hover:bg-gray-700 hover:text-white"
                                        >
                                            <div className="w-full">
                                                <UserCard police={p} />
                                            </div>
                                        </a>
                                    );
                                })}
                            </nav>
                        </SimpleBar>
                    </div>

                    <nav data-dev-hint="second-main-navigation or footer navigation">
                        <hr />
                        <button
                            onClick={terminateSession}
                            className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-base px-8 py-3 rounded shadow-md hover:shadow-lg outline-none focus:outline-none m-4 ease-linear transition-all duration-150"
                            type="button"
                        >
                            End bandobust
                        </button>
                    </nav>
                </aside>

                <main id="content" className="flex-1 p-1 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {currSession.startDateTime && (
                            <div className="pt-4">
                                <span className="text-xs font-bold inline-block py-1 px-2 rounded text-pink-600 bg-pink-200 uppercase last:mr-0 mr-1">
                                    Start time:{" "}
                                    {moment
                                        .utc(currSession.startDateTime)
                                        .local()
                                        .format("YYYY-MMM-DD h:mm A")}
                                </span>
                                <span className="text-xs font-bold inline-block py-1 px-2 rounded text-pink-600 bg-pink-200 uppercase last:mr-0 mr-1">
                                    End time:{" "}
                                    {moment
                                        .utc(currSession.endDateTime)
                                        .local()
                                        .format("YYYY-MMM-DD h:mm A")}
                                </span>
                                <span className="text-xs font-bold inline-block py-1 px-2 rounded text-pink-600 bg-pink-200 uppercase last:mr-0 mr-1">
                                    {currSession.bandobustName}
                                </span>
                            </div>
                        )}
                        <div className="px-4 py-6 sm:px-0">
                            <div className="border-4 border-blue-200 rounded-lg">
                                <div ref={mapContainer} className="map-container-dashboard" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
