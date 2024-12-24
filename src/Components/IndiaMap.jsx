import React, { useState, useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_india from "@amcharts/amcharts4-geodata/indiaLow"; // India map data
import jsonData from "./jsonData.json"; // Assuming the JSON file is named 'data.json'
import "./IndiaMap.css";

const IndiaMap = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [subtypes, setSubtypes] = useState([]);

  useEffect(() => {
    // Create map instance
    const chart = am4core.create("chartdiv", am4maps.MapChart);

    chart.logo.disabled = true;

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

    // Set tooltip text
    polygonTemplate.tooltipText = "{name}";

    // Event listener when a region is clicked
    polygonSeries.mapPolygons.template.events.on("hit", (event) => {
      const stateName = event.target.dataItem.dataContext.name;
      setSelectedState(stateName);

      // Extract and sort subtypes based on animal name and subtypes alphabetically
      const stateData = jsonData.states.find(
        (state) => state.state_name === stateName
      );

      if (stateData) {
        const sortedAnimals = stateData.animals.sort((a, b) =>
          a.animalname.localeCompare(b.animalname)
        );

        const sortedSubtypes = sortedAnimals.flatMap((animal) =>
          animal.subtypes.sort((a, b) => a.name.localeCompare(b.name))
        );

        setSubtypes(sortedSubtypes);
      } else {
        setSubtypes([]);
      }
    });

    // Cleanup the chart on unmount
    return () => {
      if (chart) {
        chart.dispose();
      }
    };
  }, []);

  const handleSubtypeClick = (subtype) => {
    if (subtype.path_to_pdf) {
      // Open PDF in a new tab
      const pdfUrl = `${window.location.origin}${subtype.path_to_pdf}`;
      window.open(pdfUrl, "_blank");
    } else {
      alert("No PDF available for this subtype.");
    }
  };

  // Close the selected state info
  const closeSelectedState = () => {
    setSelectedState(null);
    setSubtypes([]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="text-center text-4xl font-bold mb-4 mt-4">Livestock India 2024</h1>
      
      {/* Map Container */}
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Map Section */}
        <div
          id="chartdiv"
          className="w-full h-[40vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] border-4 border-pink-300 rounded-lg shadow-lg mb-4"
        ></div>

        {/* PDF Links Section */}
        {selectedState && (
          <div className="demo w-full md:w-auto flex-grow flex items-center justify-center overflow-y-auto">
            <div className="select w-full sm:h-full lg:h-[80vh] max-w-md md:max-w-xl lg:max-w-3xl p-6 rounded-lg bg-white relative">
              <h2 className="text-3xl text-center font-bold mb-4">
                {selectedState}
              </h2>
              <button
                onClick={closeSelectedState}
                className="absolute top-2 right-2 bg-red-500 h-7 w-7 text-white p-1 rounded-full"
              >
                ×
              </button>
              {subtypes.length > 0 ? (
                <div className="mt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {subtypes.map((subtype, index) => (
                      <button
                        key={index}
                        className="cursor-pointer p-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center w-full"
                        onClick={() => handleSubtypeClick(subtype)}
                      >
                        <span className="text-center">{subtype.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center">No PDFs available for this state.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndiaMap;
