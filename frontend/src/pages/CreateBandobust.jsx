import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { notifyError, notifySuccess } from "../utils/toastify";
import { Link } from "react-router-dom";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const CreateBandobust = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const draw = useRef(null);
    const [bandobustName, setBandobustName] = useState();

    useEffect(() => {
        if (map.current) return; // Initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [77.209, 28.6139],
            zoom: 10,
        });

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

        draw.current = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true,
            },

            defaultMode: "draw_polygon",
        });

        map.current.addControl(draw.current);
    });

    const createBandobust = async () => {
        const coordinates = draw.current.getAll().features[0]?.geometry.coordinates;
        if (!coordinates || coordinates[0].length <= 2)
            notifyError("Geofencing missing, please a draw polygon on map.");
        else {
            try {
                const res = await axios.post("/admin/create-session", { geoFencing: coordinates });
                notifySuccess("Successful");
                console.log(res);
            } catch (error) {
                notifyError(error.response.data.err);
                console.log(error.response.data.err);
            }
        }
    };

    return (
        <div className="bg-slate-900">
            <div className="flex">
                <div className="max-w-fit mx-4 mr-0">
                    <div className="flex content-center items-center justify-center h-full">
                        <div className="flex flex-col rounded-md bg-blue-50">
                            <div className="rounded-t px-6 py-4"></div>
                            <div className="flex-auto px-6 py-6 pt-0">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={["DateTimePicker"]}>
                                        <DateTimePicker label="Bandobust start time" />
                                    </DemoContainer>
                                </LocalizationProvider>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={["DateTimePicker"]}>
                                        <DateTimePicker label="Bandobust end time" />
                                    </DemoContainer>
                                </LocalizationProvider>

                                <div className="mb-3">
                                    <label
                                        className="block uppercase text-gray-800 text-xs font-bold mb-2"
                                        htmlFor="grid-password"
                                    ></label>
                                    <input
                                        onChange={(e) => setBandobustName(e.target.value)}
                                        type="password"
                                        className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                        placeholder="Bandobust name"
                                        style={{ transition: "all .15s ease" }}
                                    />
                                </div>

                                <div className="text-center mt-6">
                                    <button
                                        onClick={createBandobust}
                                        className="bg-blue-900 text-white active:bg-blue-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                                        type="button"
                                        style={{ transition: "all .15s ease" }}
                                    >
                                        Create Bandobust
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    ref={mapContainer}
                    className="map-container-create-bandobust border-solid rounded border-4 border-blue-300 w-5/6 m-4"
                />
            </div>
        </div>
    );
};

export default CreateBandobust;
