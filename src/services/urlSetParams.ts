import makeQueryString from "./makeQuery";

export const SearchParams = (): [(object: object) => void, () => any] => {
  const setParams = (object: object) => {
    const params = makeQueryString(object);
    window.history.replaceState(
      null,
      "Unical Erp",
      window.location.href.split("?")[0] + params
    );
  };

  const getParams = () => {
    const checkType = (value: any) => {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    };
    let object = new URLSearchParams(document.location.search);

    const params: any = {};
    object.forEach((value, key) => {
      if (params[key]) {
        if (Array.isArray(params[key]))
          params[key] = [...params[key], checkType(value)];
        else params[key] = [params[key], checkType(value)];
      } else if (key === "search") params[key] = value;
      else params[key] = checkType(value);
    });
    return params;
  };

  return [setParams, getParams];
};
