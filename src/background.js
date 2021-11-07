let notion_database_id = null;
let notion_token = null;
let urlQueryDatabases = "https://api.notion.com/v1/databases/{notion_database_id}/query";
let urlAddPage = "https://api.notion.com/v1/pages";

function format(format_str, param_map){
    let key = null;
    for (key in param_map){
        format_str = format_str.replaceAll(`{${key}}`, param_map[key]);
    }
    return format_str;
}

chrome.runtime.onInstalled.addListener(() => {
    let notion_database_id = "2359dc1ba47e4a03a3a904b5a4ef078a";
    let notion_token = "Bearer secret_8REWwrsPx6jaO5dbghKP3Oc0lTsK8BT69A81ZC1GAx1";
    let notion_version = "2021-08-16";
    chrome.storage.sync.set({ "notion_token": notion_token }, function () { console.debug("set notion_token: " + notion_token) });
    chrome.storage.sync.set({ "notion_database_id": notion_database_id }, function () { console.debug("set notion_database_id: " + notion_database_id) });
    chrome.storage.sync.set({ "notion_version": notion_version }, function () { console.debug("set notion_version: " + notion_version) });
});

function fetchNotion(url, method, params, sender, sendResponse){
    chrome.storage.sync.get(["notion_token", "notion_version"], function ({notion_token, notion_version}) {
        let init = {
            method: method,
            headers: {
                "Authorization": notion_token,  //result.notion_token,
                "Notion-Version": notion_version,  //result.notion_version,
                "Content-Type": "application/json",
            }
        }
        if (method=='POST'){
            init['mode'] = 'cors'
        }
        if (params != null){
            init['body'] = JSON.stringify(params);
        }
        fetch(url, init).then(response => response.json()).then(res=>sendResponse(res));
    });
}

function queryDatabases(params, sender, sendResponse) {
    chrome.storage.sync.get(["notion_database_id"], ({notion_database_id}) => {
        let url =  format(urlQueryDatabases, {notion_database_id:notion_database_id});
        console.log(url,"---------------");
        fetchNotion(url, "POST", params, sender, sendResponse, sendResponse)
    });
}

function addPage(params, sender, sendResponse){
    fetchNotion(urlAddPage, "GET", params, sender, sendResponse)
}

let messageGuide = {
    "queryDatabases": queryDatabases,
    "addPage": addPage,
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    func = messageGuide[request.action];
    console.log(request.action, func, request.message);
    func(request.message, sender, sendResponse);
    return true;
})
