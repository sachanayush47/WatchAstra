import React, { useState, useEffect, useRef } from "react";
import BIRDS from "vanta/dist/vanta.rings.min";
import * as THREE from "three";
export default function Home() {
    const [vantaEffect, setVantaEffect] = useState(0);
    const vantaRef = useRef(null);

    useEffect(() => {
        if (!vantaEffect) {
            setVantaEffect(
                BIRDS({
                    el: vantaRef.current,
                    THREE: THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.0,
                    minWidth: 200.0,
                    scale: 1.0,
                    scaleMobile: 1.0,
                    backgroundColor: 0x0,
                })
            );
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    return (
        <>
            <main>
                <div
                    className="relative pt-16 pb-32 flex content-center items-center justify-center"
                    style={{
                        minHeight: "75vh",
                    }}
                >
                    <div
                        ref={vantaRef}
                        id="vanta"
                        className="absolute top-0 w-full h-full bg-center bg-cover"
                        // style={{
                        //     backgroundImage:
                        //         "url('https://images.unsplash.com/photo-1557081999-0ea3e23579d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1771&q=80')",
                        // }}
                    >
                        {/* <span
                            id="blackOverlay"
                            className="w-full h-full absolute opacity-50 bg-black"
                        ></span> */}
                    </div>
                    <div className="container relative mx-auto">
                        <div className="items-center flex flex-wrap">
                            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                                <div className="">
                                    <h1 className="text-white font-semibold text-4xl">
                                        Watch Astra
                                        <span>&nbsp;</span>
                                        <i class="fa-sharp fa-solid fa-shield-halved"></i>
                                    </h1>
                                    <p className="italic font-medium mt-4 text-lg text-gray-300">
                                        Empowering Law Enforcement
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="bg-black -mt-24">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap">
                            <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                                    <div className="px-4 py-5 flex-auto">
                                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                                            <i className="fas fa-award"></i>
                                        </div>
                                        <h6 className="text-xl font-semibold">
                                            Real-time tracking
                                        </h6>
                                        <p className="mt-2 mb-4 text-gray-600">
                                            The ability to track individuals or groups of people in
                                            real-time using GPS technology.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-4/12 px-4 text-center">
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                                    <div className="px-4 py-5 flex-auto">
                                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400">
                                            <i className="fas fa-retweet"></i>
                                        </div>
                                        <h6 className="text-xl font-semibold">
                                            Geofencing technology
                                        </h6>
                                        <p className="mt-2 mb-4 text-gray-600">
                                            The ability to create virtual boundaries or geofences
                                            around specific locations, such as a workplace or
                                            hospital, to monitor and track individuals as they move
                                            in and out of these areas.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 w-full md:w-4/12 px-4 text-center">
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                                    <div className="px-4 py-5 flex-auto">
                                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-400">
                                            <i className="fas fa-fingerprint"></i>
                                        </div>
                                        <h6 className="text-xl font-semibold">
                                            Randomized biometric verification
                                        </h6>
                                        <p className="mt-2 mb-4 text-gray-600">
                                            Use of randomized biometric verification at random
                                            intervals, ensuring that individuals are present, while
                                            also preventing prohibited activities during work hours.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
