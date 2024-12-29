import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip'

import 'react-tooltip/dist/react-tooltip.css'

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Tag {
  id?: number;
  name: string;
  category: 'region' | 'topic' | 'technology' | 'framework' | 'country' | 'unknown';
}

interface BaseSearchResult {
  title: string;
  summary: string;
  source_url: string;
  relevance_score: number;
  source: 'internal' | 'external';
  tags: Tag[];
}

interface MapChartProps {
  results: BaseSearchResult[];
  setSearchQuery: (query: string) => void;
}

const MapChart: React.FC<MapChartProps> = ({ setSearchQuery }) => {
  const handleCountryClick = (geo: any) => {
    const countryName = geo.properties["name"];
    setSearchQuery(countryName);
  };

  return (
    <div style={{ width: "100%", height: "auto" }}>
      <Tooltip id="country" place="top"
        render={({ content }) => (
          <span>
            {content}
            <br />
          </span>
        )}
      />
      <ComposableMap>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleCountryClick(geo)}
                data-tooltip-content={geo.properties["name"]}
                data-tooltip-id="country"
                style={{
                  default: {
                    fill: "#042449",
                  },
                  hover: {
                    fill: "rgba(86, 141, 67, 0.5)",
                  },
                  // pressed: {
                  //   fill: "#1E3f66",
                  // },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default MapChart;