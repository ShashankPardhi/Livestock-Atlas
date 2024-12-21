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
    polygonTemplate.fill = am4core.color("#74b266");
    polygonTemplate.stroke = am4core.color("#ffffff");
    polygonTemplate.strokeWidth = 0.5;

    // Set hover effect
    polygonTemplate.states.create("hover").properties.fill = am4core.color("#ffffff");
    polygonTemplate.states.create("hover").properties.stroke = am4core.color("#000000"); // Black stroke on hover

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
      <h1 className="text-center text-4xl font-bold">Livestock India 2024</h1>
      <div className="flex">
        <div
          id="chartdiv"
          className="map w-full h-screen border-4 border-pink-300 rounded-lg shadow-lg mb-4"
        ></div>

        {/* The content div will not inherit the opacity */}
        {selectedState && (
  <div className="demo bg-black  w-full h-screen absolute top-0 left-0 ">
    {/* Content div with no opacity effect */}
    <div className="select absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm p-4 rounded-lg shadow-lg z-20">
  {/* Background with opacity */}
  <div className="absolute inset-0 bg-white opacity-75 rounded-lg pointer-events-none"></div>

  {/* Content above the background */}
  <div className="relative z-10">
    <h2 className="text-2xl text-center font-bold mb-2">{selectedState}</h2>

    <button
      onClick={closeSelectedState}
      className="absolute top-2 right-2 bg-red-500 h-auto text-white p-1 rounded-md"
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
      <div>
        <h3 className="text-lg font-semibold mb-2"></h3>
        {subtypes.map((subtype, index) => (
          <button
            key={index}
            className="cursor-pointer m-2 p-2 flex flex-col bg-slate-500 text-white rounded-sm w-full font-semibold hover:underline"
            onClick={() => handleSubtypeClick(subtype)}
          >
            {subtype.name}
          </button>
        ))}
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
