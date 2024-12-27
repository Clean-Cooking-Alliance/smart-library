import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const MapChart = () => {
    return (
      <div style={{ width: "100%", height: "auto" }}> {/* Use CSS to control the size */}
        <ComposableMap>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography style={{
                  default: {
                    fill: "blue",
                  },
                  hover: {
                    fill: "#91BAD6",
                  },
                  pressed: {
                    fill: "#1E3f66",
                  },
                }}
                  key={geo.rsmKey} geography={geo} />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>
    );
  };

export default MapChart;