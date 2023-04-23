import React from "react";
import moment from "moment";

const UserCard = ({ police }) => {
    return (
        <div class="mx-2 border-8 border-green-500 border-solid rounded-sm">
            <div class="flex bg-blue-50 shadow-lg overflow-hidden">
                <div
                    class="w-2/5 bg-cover"
                    style={{
                        backgroundImage: "url('https://source.unsplash.com/random/600x800?human')",
                    }}
                ></div>
                <div class="w-3/5 px-2 py-1 font-semibold">
                    <h1 class="text-gray-900 font-bold text-2xl">{police.name}</h1>
                    <p class="text-gray-600 text-sm">
                        Entry: {moment.utc(police.entry).local().format("YYYY-MMM-DD h:mm A")}
                    </p>
                    <p class="text-gray-600 text-sm">
                        Exit:{" "}
                        {police.exit &&
                            moment.utc(police.exit).local().format("YYYY-MMM-DD h:mm A")}
                    </p>
                    <p class="text-gray-600 text-sm">Status: Online</p>
                    <p class="text-gray-600 text-sm">Verification status: All ok</p>
                    <p class="text-gray-600 text-sm">Phone: {police.phone}</p>
                    <div class="flex item-center mt-2"></div>
                    {/* <div class="flex item-center justify-between mt-3">
                        <h1 class="text-gray-700 font-bold text-xl">$220</h1>
                        <button class="px-3 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded">
                            Add to Card
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default UserCard;
