export const urlPath = "http://localhost/react-vite/viter-hris";
export const devNavUrl = "";
export const apiVersion = "/v1";
export const devApiUrl = urlPath + "/rest";

// Roles variable
export const urlDeveloper = "developer";

// dev API KEY
export const devKey = "123devkey";

// format the numbers separated by comma
export const isEmptyItem = (item, x = "") => {
  let result = x;

  if (typeof item !== "undefined" && item !== "") {
    result = item;
  }
  return result;
};
