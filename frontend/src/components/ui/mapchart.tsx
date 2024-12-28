import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

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
      <ComposableMap>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleCountryClick(geo)}
                style={{
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
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default MapChart;