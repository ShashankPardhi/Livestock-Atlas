import React, { useState, useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_india from "@amcharts/amcharts4-geodata/indiaLow"; // India map data
import jsonData from "./jsonData.json"; // Assuming the JSON file is named 'data.json'

const IndiaMap = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [subtypes, setSubtypes] = useState([]);

  useEffect(() => {
    // Create map instance
    const chart = am4core.create("chartdiv", am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_india;

    // Set projection
    chart.projection = new am4maps.projections.Mercator();

    // Create map polygon series
    const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;

    // Configure the appearance of the polygons (regions)
    const polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.fill = am4core.color("#b0dba7");
    polygonTemplate.stroke = am4core.color("#ffffff");
    polygonTemplate.strokeWidth = 0.5;

    // Set hover effect
    polygonTemplate.states.create("hover").properties.fill = am4core.color("#74b266");
    polygonTemplate.states.create("hover").properties.stroke = am4core.color("#ffffff"); // Black stroke on hover

    // Set tooltip text
    polygonTemplate.tooltipText = "{name}";

    // Event listener when a region is clicked
    polygonSeries.mapPolygons.template.events.on("hit", (event) => {
      const stateName = event.target.dataItem.dataContext.name;
      setSelectedState(stateName);
      setSelectedAnimal(null); // Reset animal selection
      console.log("Selected State:", stateName);
    });

    // Cleanup the chart on unmount
    return () => {
      if (chart) {
        chart.dispose();
      }
    };
  }, []);

  const handleAnimalChange = (event) => {
    const animalName = event.target.value;
    setSelectedAnimal(animalName);

    const stateData = jsonData.states.find(
      (state) => state.state_name === selectedState
    );
    const animalData = stateData.animals.find(
      (animal) => animal.animalname === animalName
    );
    setSubtypes(animalData ? animalData.subtypes : []);
    console.log("Selected Animal:", animalName);
  };

  const handleSubtypeClick = (subtype) => {
    if (subtype.path_to_pdf) {
      // Log the PDF path for debugging
      console.log("Opening PDF:", subtype.path_to_pdf);

      // Open PDF in a new browser tab
      const pdfUrl = `${window.location.origin}${subtype.path_to_pdf}`; // Construct the full URL
      window.open(pdfUrl, "_blank"); // Open the PDF in a new tab
    } else {
      alert("No PDF available for this subtype.");
      console.log("No PDF available for:", subtype.name);
    }
  };

  // Close the selected state info
  const closeSelectedState = () => {
    setSelectedState(null);
    setSelectedAnimal(null);
    setSubtypes([]);
  };

  return (
    <div className="p-4 min-h-screen relative">
      <h1 className="text-center text-4xl font-bold mb-4">Livestock India 2024</h1>
      <div className="flex flex-col md:flex-row">
        <div
          id="chartdiv"
          className="map w-full h-96 md:h-screen border-4 border-pink-300 rounded-lg shadow-lg mb-4 md:mb-0"
        ></div>

        {/* The content div will not inherit the opacity */}
        {selectedState && (
          <div className="demo bg-black bg-opacity-75 w-full h-full absolute top-0 left-0 flex items-center justify-center">
            {/* Centered Select Div */}
            <div className="select w-full max-w-md p-4 rounded-lg shadow-lg z-20 bg-white relative">
              <div className="absolute inset-0 bg-white rounded-lg pointer-events-none"></div>

              {/* Content above the background */}
              <div className="relative z-10">
                <h2 className="text-2xl text-center font-bold mb-2">{selectedState}</h2>

                <button
                  onClick={closeSelectedState}
                  className="absolute top-2 right-2 bg-red-500 h-7 w-7 text-white p-1 rounded-full"
                >
                  ×
                </button>

                <label className="block mb-2">
                  <span className="text-gray-700">Select Livestock:</span>
                  <select
                    value={selectedAnimal || ""}
                    onChange={handleAnimalChange}
                    className="block w-full mt-1 border rounded p-2"
                  >
                    <option value="" disabled>
                      -- Choose Livestock --
                    </option>
                    {jsonData.states
                      .find((state) => state.state_name === selectedState)
                      ?.animals.map((animal) => (
                        <option key={animal.animalname} value={animal.animalname}>
                          {animal.animalname}
                        </option>
                      ))}
                  </select>
                </label>

                {selectedAnimal && subtypes.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Subtypes</h3>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 md:grid-cols-2">
                      {subtypes.map((subtype, index) => (
                        <button
                          key={index}
                          className="cursor-pointer p-3 bg-[#b23325] text-white rounded-sm font-semibold hover:underline focus:outline-none focus:ring-2"
                          onClick={() => handleSubtypeClick(subtype)}
                        >
                          {subtype.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndiaMap;
