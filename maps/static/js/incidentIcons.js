const fontsize = 17;

const litterIcon = {
  type: "text", // autocasts as new TextSymbol()
  // color: "#7A003C",
  text: "\ue677", // esri-icon-map-pin
  font: {
    // autocasts as new Font()
    size: fontsize,
    family: "CalciteWebCoreIcons" // Esri Icon Font
  }
};
const loiteringIcon = {
  type: "text", // autocasts as new TextSymbol()
  // color: "#7A003C",
  text: "\ue655", // esri-icon-map-pin
  font: {
    // autocasts as new Font()
    size: fontsize,
    family: "CalciteWebCoreIcons" // Esri Icon Font
  }
};
const graffitiIcon = {
  type: "text", // autocasts as new TextSymbol()
  // color: "#7A003C",
  text: "\ue65f", // esri-icon-map-pin
  font: {
    // autocasts as new Font()
    size: fontsize,
    family: "CalciteWebCoreIcons" // Esri Icon Font
  }
};
const speedingIcon = {
  type: "text", // autocasts as new TextSymbol()
  // color: "#7A003C",
  text: "\ue646", // esri-icon-map-pin
  font: {
    // autocasts as new Font()
    size: fontsize,
    family: "CalciteWebCoreIcons" // Esri Icon Font
  }
};
const parkingIcon = {
  type: "text", // autocasts as new TextSymbol()
  // color: "#7A003C",
  text: "P", // esri-icon-map-pin
  font: {
    // autocasts as new Font()
    size: fontsize,
    family: "CalciteWebCoreIcons" // Esri Icon Font
  }
};

var incidentIcons = {
  'littering': litterIcon,
  'loitering': loiteringIcon,
  'graffiti': graffitiIcon,
  'speeding': speedingIcon,
  'parking': parkingIcon,
}
