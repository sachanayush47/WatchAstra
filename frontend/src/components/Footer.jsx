import React from "react";

export const Footer = () => {
    return (
        <footer className="bg-zinc-950 mx-auto px-6 py-10">
            <div className="">
                <div className="flex items-center space-x-3">
                    <div className="text-white text-4xl">
                        <i class="fa-sharp fa-solid fa-shield-halved"></i>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-black dark:text-gray-100">
                            WatchAstra
                        </h1>
                    </div>
                </div>
                <div className="flex space-x-6 mt-8">
                    <span className="text-3xl text-white">
                        <i className="fa-brands fa-facebook"></i>
                    </span>
                    <span className="text-3xl text-white">
                        <i className="fa-brands fa-twitter"></i>
                    </span>
                    <span className="text-3xl text-white">
                        <i className="fa-brands fa-instagram"></i>
                    </span>
                    <span className="text-3xl text-white">
                        <i className="fa-brands fa-youtube"></i>
                    </span>
                </div>
                <div className="mt-8">
                    <ul className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-6 lg:space-x-12 items-start md:items-center font-semibold text-base text-gray-700 dark:text-gray-100">
                        <li>About us</li>
                        <li>Company History</li>
                        <li>Our Team</li>
                        <li>Our Vision</li>
                        <li>Press Release</li>
                    </ul>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id lectus mattis in
                    nunc lorem nullam phasellus fringilla eget. Quis in amet interdum arcu
                    suspendisse urna, leo non sed.
                </p>
            </div>
        </footer>
    );
};
