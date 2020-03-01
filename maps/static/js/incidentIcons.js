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
const loitteringIcon = {
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
  text: "<i class=\"material-icons\">directions_car</i>", // esri-icon-map-pin
  font: {
    // autocasts as new Font()
    size: fontsize,
  }
};
const speedingIcon = {
  type: "text", // autocasts as new TextSymbol()
  // color: "#7A003C",
  text: "<i class=\"material-icons\">photo</i>", // esri-icon-map-pin
  font: {
    // autocasts as new Font()
    size: fontsize,
  }
};

var incidentIcons = {
  'littering': litterIcon,
  'loittering': loitteringIcon,
  'graffiti': graffitiIcon,
  'speeding': speedingIcon,
}
