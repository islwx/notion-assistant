let COLORS = [
  "default",
  "gray",
  "brown",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
];

function multiseletByArr(arr) {
  if (arr == null) {
    return null;
  }
  let multi_select_obj = [];
  arr.forEach((ele) => {
    multi_select_obj.push({ name: ele });
  });
  return { multi_select: multi_select_obj };
}

function titleByStr(str) {
  return {
    title: [
      {
        type: "text",
        text: {
          content: str,
        },
      },
    ],
  };
}

function textByStr(str) {
  if (str == null) {
    return null;
  }
  return {
    rich_text: [
      {
        text: {
          content: str,
        },
      },
    ],
  };
}

function getSelect(str, color = null) {
  if (str == null) {
    return null;
  }
  let select_obj = {
    select: {
      name: str,
    },
  };
  if (color != null && color in COLORS) {
    select_obj["select"]["color"] = color;
  }
  return select_obj;
}

function DateByISO8601(start, end = null) {
  if (start == null) {
    return null;
  }
  let date = {
    date: {
      start: convert2iso8601(start),
    },
  };
  if (end != null) {
    date["date"]["end"] = end;
  }
  return date;
}

function getNumber(num) {
  if (num == NaN || num == null) {
    return null;
  }
  return { number: num };
}

function convert2iso8601(str) {
  let data = str.split("-");
  if (data.length == 1) {
    data[1] = "01";
  }
  if (data.length == 2) {
    data[2] = "01";
  }
  if (data[1].length == 1) {
    data[1] = "0" + data[1];
  }
  if (data[2].length == 1) {
    data[2] = "0" + data[2];
  }
  return data.join("-") + "T12:00:00Z";
}

function getURL(url) {
  if (url == null) {
    return null;
  }
  return { url: url };
}
