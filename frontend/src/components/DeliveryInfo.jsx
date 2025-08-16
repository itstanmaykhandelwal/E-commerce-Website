import React, { useState, useEffect } from "react";
import { State, City } from "country-state-city"; // 👉 Library import

const DeliveryInfo = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [deliveryRange, setDeliveryRange] = useState("");

    // Delivery Date Range (6-8 din ka gap)
    useEffect(() => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + 6);
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 8);

        const options = { month: "short", day: "numeric" };
        setDeliveryRange(
            `${startDate.toLocaleDateString("en-US", options)} - ${endDate.toLocaleDateString("en-US", options)}`
        );
    }, []);

    // Fetch all states of India using library
    useEffect(() => {
        const allStates = State.getStatesOfCountry("IN");
        setStates(allStates);
    }, []);

    // Fetch cities of selected state
    useEffect(() => {
        if (state) {
            const allCities = City.getCitiesOfState("IN", state);
            setCities(allCities);
        } else {
            setCities([]);
        }
    }, [state]);

    // Auto detect location
    const detectLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();

                    if (data.address) {
                        const detectedState = data.address.state;
                        const detectedCity = data.address.city || data.address.town || data.address.village;

                        // Match state from library
                        const matchedState = states.find(
                            (s) => s.name.toLowerCase() === detectedState.toLowerCase()
                        );

                        if (matchedState) {
                            setState(matchedState.isoCode);

                            // Load matched cities
                            const allCities = City.getCitiesOfState("IN", matchedState.isoCode);
                            setCities(allCities);

                            // Match detected city
                            const matchedCity = allCities.find(
                                (c) => c.name.toLowerCase() === detectedCity?.toLowerCase()
                            );
                            if (matchedCity) {
                                setCity(matchedCity.name);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Location detect error:", error);
                }
            });
        } else {
            alert("Geolocation not supported by your browser");
        }
    };

    return (
        <div className="mt-6 border rounded-lg p-4 text-sm text-gray-700">
            <p className="flex items-center gap-1">
                <span>📍 Deliver to</span>
                <span
                    className="text-blue-600 cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    {city && state ? `${city}, ${state}` : "Select Location"}
                </span>
            </p>
            <p>
                Order before: <b>2:00 PM</b>
            </p>
            <p>
                Estimated delivery: <b>{deliveryRange}</b>
            </p>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">Select Delivery Location</h2>
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded"
                            onClick={detectLocation}
                        >
                            Auto Detect My Location
                        </button>
                        <div className="flex flex-col gap-3">
                            {/* State Select */}
                            <div>
                                <label className="block mb-1">State</label>
                                <select
                                    className="border p-2 w-full"
                                    value={state}
                                    onChange={(e) => {
                                        setState(e.target.value);
                                        setCity("");
                                    }}
                                >
                                    <option value="">Select State</option>
                                    {states.map((s) => (
                                        <option key={s.isoCode} value={s.isoCode}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* City Select */}
                            <div>
                                <label className="block mb-1">City</label>
                                <select
                                    className="border p-2 w-full"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    disabled={!state}
                                >
                                    <option value="">Select City</option>
                                    {cities.map((c, index) => (
                                        <option key={index} value={c.name}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={() => setIsModalOpen(false)}
                                disabled={!state || !city}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryInfo;
