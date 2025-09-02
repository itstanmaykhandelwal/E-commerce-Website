import React, { useState, useEffect } from "react";
import { State, City } from "country-state-city";

const DeliveryInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stateCode, setStateCode] = useState("");
  const [city, setCity] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [deliveryRange, setDeliveryRange] = useState("");

  // Delivery date range (6-8 din)
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

  // Load all states
  useEffect(() => {
    setStates(State.getStatesOfCountry("IN") || []);
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (stateCode) {
      setCities(City.getCitiesOfState("IN", stateCode) || []);
    } else {
      setCities([]);
    }
  }, [stateCode]);

  // Auto detect location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();

        if (data?.address) {
          const detectedState = data.address.state || "";
          const detectedCity =
            data.address.city || data.address.town || data.address.village || "";

          // Match state safely
          const matchedState = states.find(
            (s) => s.name?.toLowerCase() === detectedState?.toLowerCase()
          );

          if (matchedState) {
            setStateCode(matchedState.isoCode);

            const allCities = City.getCitiesOfState("IN", matchedState.isoCode);
            setCities(allCities);

            const matchedCity = allCities.find(
              (c) => c.name?.toLowerCase() === detectedCity?.toLowerCase()
            );
            if (matchedCity) {
              setCity(matchedCity.name);
            }
          }
        }
      } catch (err) {
        console.error("Location detect error:", err);
      }
    });
  };

  // Get state name from isoCode
  const getStateName = (code) => {
    const st = states.find((s) => s.isoCode === code);
    return st ? st.name : code;
  };

  return (
    <div className="mt-6 border rounded-lg p-4 text-sm text-gray-700">
      <p className="flex items-center gap-1">
        <span>📍 Deliver to</span>
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          {city && stateCode ? `${city}, ${getStateName(stateCode)}` : "Select Location"}
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
              className="px-4 py-2 bg-green-600 text-white rounded mb-3"
              onClick={detectLocation}
            >
              Auto Detect My Location
            </button>

            {/* State Select */}
            <div className="mb-3">
              <label className="block mb-1">State</label>
              <select
                className="border p-2 w-full"
                value={stateCode}
                onChange={(e) => {
                  setStateCode(e.target.value);
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
                disabled={!stateCode}
              >
                <option value="">Select City</option>
                {cities.map((c, i) => (
                  <option key={i} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
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
                disabled={!stateCode || !city}
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
