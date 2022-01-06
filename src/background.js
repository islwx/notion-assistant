let notion_token = null;
let urlQueryDatabases =
  "https://api.notion.com/v1/databases/{notion_database_id}/query";
let urlAddPage = "https://api.notion.com/v1/pages";

/**
 * 切割特殊字符：format_str: 'this is {name}', param_map: { 'name': Mark }, => 'this is Mark'
 * @param {*String} format_str
 * @param {*Array} param_map
 * @returns String
 */
function format(format_str, param_map) {
  return Object.keys(param_map).reduce(
    (current, key) => current.replaceAll(`{${key}}`, param_map[key]),
    format_str
  );
}

function init_notion() {
  chrome.storage.sync.get(
    ["notion_token", "notion_book_database_id", "notion_paper_database_id"],
    function ({ notion_token, notion_book_database_id, notion_paper_database_id}) {
      if ((notion_token == null) | (notion_book_database_id == null) | (notion_paper_database_id == null)) {
        console.log("init notion msg");
        fetch("./config/config.json")
          .then((response) => response.json())
          .then((res) => {
            let notion_version = "2021-08-16";
            let notion_token = "Bearer " + res["notion_token"];
            let notion_book_database_id = res["notion_book_database_id"];
            let notion_paper_database_id = res["notion_paper_database_id"];
            chrome.storage.sync.set(
              { notion_token: notion_token },
              function () {
                console.debug("set notion_token: " + notion_token);
              }
            );
            chrome.storage.sync.set(
              { notion_book_database_id: notion_book_database_id },
              function () {
                console.debug("set notion_book_database_id: " + notion_book_database_id);
              }
            );
            chrome.storage.sync.set(
              { notion_paper_database_id: notion_paper_database_id },
              function () {
                console.debug("set notion_paper_database_id: " + notion_paper_database_id);
              }
            );
            chrome.storage.sync.set(
              { notion_version: notion_version },
              function () {
                console.debug("set notion_version: " + notion_version);
              }
            );
          });
      } else {
        console.log("reload");
      }
    }
  );
}

chrome.runtime.onInstalled.addListener(() => {
  init_notion();
});

function fetchNotion(url, method, params, sender, sendResponse) {
  chrome.storage.sync.get(
    ["notion_token", "notion_version"],
    function ({ notion_token, notion_version }) {
      let init = {
        method: method,
        headers: {
          Authorization: notion_token, //result.notion_token,
          "Notion-Version": notion_version, //result.notion_version,
          "Content-Type": "application/json",
        },
      };
      if (method == "POST") {
        init["mode"] = "cors";
      }
      if (params != null) {
        init["body"] = JSON.stringify(params);
      }
      fetch(url, init)
        .then((response) => response.json())
        .then((res) => sendResponse(res));
    }
  );
}

function queryDatabases(params, sender, sendResponse) {
  let notion_database_name = params['notion_database_name'];
  delete params['notion_database_name']
  chrome.storage.sync.get([notion_database_name], ({ notion_database_id }) => {
    let url = format(urlQueryDatabases, {
      notion_database_id: notion_database_id,
    });
    fetchNotion(url, "POST", params, sender, sendResponse, sendResponse);
  });
}

function addPage(params, sender, sendResponse) {
  for (let key in params["properties"]) {
    if (params["properties"][key] == null) {
      delete params["properties"][key];
    }
  }

  console.log(params);
  fetchNotion(urlAddPage, "POST", params, sender, sendResponse);
}

let messageGuide = {
  queryDatabases: queryDatabases,
  addPage: addPage,
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  func = messageGuide[request.action];
  console.log(request.action, func, request.message);
  func(request.message, sender, sendResponse);
  return true;
});
