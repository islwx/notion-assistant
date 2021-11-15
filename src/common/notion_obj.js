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
  if (!arr) return null;
  const multi_select_obj = [];
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
  if (!str) return null;
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
  if (!str) return null;
  const select_obj = {
    select: {
      name: str,
    },
  };
  if (color && color in COLORS) select_obj["select"]["color"] = color;
  return select_obj;
}

function DateByISO8601(start, end = null) {
  if (!start) return null;
  const date = {
    date: {
      start: convert2iso8601(start),
    },
  };
  if (end) date["date"]["end"] = end;
  return date;
}

function getNumber(num) {
  return num ? { number: num } : null;
}

function convert2iso8601(str) {
  const time = new Date(str);
  return JSON.stringify(time) === "null"
    ? new Date().toISOString()
    : time.toISOString();
}

function getURL(url) {
  return url ? { url } : null;
}
