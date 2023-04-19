import React from "react";

const UserCard = () => {
    return (
        <div class="m-2 border-8 border-green-500 border-solid rounded-lg">
            <div class="flex max-w-md bg-white shadow-lg  overflow-hidden">
                <div
                    class="w-1/3 bg-cover"
                    style={{
                        backgroundImage:
                            "url('https://assets.telegraphindia.com/telegraph/c9627afa-adc4-4123-82d0-4c9d854dcceb.jpg')",
                    }}
                ></div>
                <div class="w-2/3 px-2 py-1">
                    <h1 class="text-gray-900 font-bold text-2xl">Arushi Joshi</h1>
                    <p class="text-gray-600 text-sm">Entry time: 16:04</p>
                    <p class="text-gray-600 text-sm">Exit time: -</p>
                    <p class="text-gray-600 text-sm">Status: Online</p>
                    <p class="text-gray-600 text-sm">Verification status: Failed</p>
                    <p class="text-gray-600 text-sm">Phone: 9874563210</p>
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
