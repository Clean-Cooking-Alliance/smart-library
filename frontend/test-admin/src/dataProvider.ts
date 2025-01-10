import jsonServerProvider from "ra-data-json-server";

export const dataProvider = jsonServerProvider(
  "http://localhost:8000/api/v1",
);
