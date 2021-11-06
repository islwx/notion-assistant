// Initialize button with user's preferred color

// let oauth = document.getElementById("changeColor0");
let changeColor = document.getElementById("changeColor");
/*
oauth.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setOAuth,
    });
});

function setOAuth(){
    let url_notion = "https://api.notion.com/v1/oauth/authorize"
    let paramObject = {
        redirect_uri: location.href,
        response_type: "code",
        owner: "user",
        client_id: null,
    }
    let queryString = Object.keys(paramObject).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])
      }).join('&');
    fetch(url_notion, {
        method: 'POST',
        mode: "no-cors",
        headers: new Headers({
            // "Content-type": "application/json",
            "Content-type": "application/x-www-form-urlencoded",
            "Authorization": 'Bearer '+token,
            "Notion-Version": NOTION_VERSION
        }),
        data: queryString,
        
    }).then((result) => {
    // }).then(response => response.json()).then((result) => {
      console.log('it worked!');
    }).catch(error => {
      console.error(error);
    });
}
*/


chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setPageBackgroundColor,
    });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
    let NOTION_KEY = "Bearer secret_8REWwrsPx6jaO5dbghKP3Oc0lTsK8BT69A81ZC1GAx1";
    let NOTION_DATABASE_ID = "2359dc1ba47e4a03a3a904b5a4ef078a";
    let NOTION_VERSION = "2021-08-16";
    /*
    function savePage(database_id, token) {
        url_notion = 'https://api.notion.com/v1/databases/' + database_id + '/query/'
        // url_notion = 'https://api.notion.com/v1/user';
        authorization = 'Bearer ' + token;
        console.log(authorization);
        console.log(url_notion);
        fetch(url_notion, {
            method: "POST",
            mode: "no-cors",
            headers: new Headers({
                "Content-type": "application/json",
                // "Authorization": 'Bearer ' + token,
                "Authorization": authorization,
                "Notion-Version": NOTION_VERSION
            }),
            // data: {
            //     "sorts": [
            //         {
            //             "property": "CreatedTime",
            //             "direction": "ascending"
            //         }
            //     ]
            // }
        }).then(response => response.json()).then((result) => {
            console.log(result);
            console.log('it worked!');
        }).catch(error => {
            console.log(error);
        })

    }*/

    chrome.storage.sync.get("color", ({ color }) => {
        // document.body.style.backgroundColor = color;
        let doubai_patt = /^https:\/\/book.douban.com\/subject\/\d+\/$/i;
        let url = document.location.href;
        if (doubai_patt.test(url)) {
            let book_name = document.head.querySelector("[property~='og:title'][content]").content;
            let url = document.head.querySelector("[property~='og:url'][content]").content;
            let img = document.head.querySelector("[property~='og:image'][content]").content;
            // let type = document.head.querySelector("[property~='og:type'][content]").content;
            let isbn = document.head.querySelector("[property~='book:isbn'][content]").content;
            let ori_name = null;
            let publisher = null;
            let translator = null;
            let authors = new Array();
            document.head.querySelectorAll("[property~='book:author'][content]").forEach(function (item) {
                authors.push(item.content.replace(/\s*$|^\s*/g, ""));
            });
            let description_arr = new Array();
            document.querySelector("div.intro").querySelectorAll('p').forEach(function (item) {
                description_arr.push(item.textContent.replace(/\s*$|^\s*/g, ""));
            });
            let description = description_arr.join("\n")

            let info = document.getElementById("info");
            let publishing_date = null;

            info.innerText.replace(/\s*$|^\s*/g, "").split("\n").forEach(function (item) {
                [key, val] = item.split(":")
                key = key.replace(/\s*$|^\s*/g, "")
                val = val.replace(/\s*$|^\s*/g, "");
                if (key == "出版社") {
                    publisher = val;
                }
                else if (key == "原作名") {
                    ori_name = val;
                }
                else if (key == "出版年") {
                    publishing_date = val;
                }
                else if (key == "译者") {
                    translator = val.split("/").map(item => item.replace(/\s*$|^\s*/g, ""));
                }
            })
            console.log(book_name)
            console.log(description)
            console.log(url)
            console.log(img)
            console.log(isbn)
            console.log(ori_name)
            console.log(publisher)
            console.log(translator)
            console.log(authors)
            console.log(publishing_date)
        }
        // savePage(NOTION_DATABASE_ID, NOTION_KEY)
        let database_id = NOTION_DATABASE_ID;
        let token = NOTION_KEY;

        // url_notion = 'https://api.notion.com/v1/databases/' + database_id + '/query/'
        url_notion = "https://api.notion.com/v1/databases/2359dc1ba47e4a03a3a904b5a4ef078a/query";
        // url_notion = 'https://api.notion.com/v1/user';
        console.log(token);
        console.log(url_notion);
        headers = new Headers({
            "Content-Type": "application/json",
            // "Authorization": 'Bearer ' + token,
            "Authorization": token,
            "Notion-Version": NOTION_VERSION,
            // "Access-Control-Allow-Origin":'https://api.notion.com/',
            // "Access-Control-Allow-Headers": "Content-Disposition,Origin, X-Requested-With, Content-Type, Accept,Authorization,id_token"
            // 'Access-Control-Allow-Credentials': 'true'

        })
        // headers.append("Content-Type", "application/json");
        // headers.append("Authorization", token);
        // headers.append("Notion-Version", "NOTION_VERSION");

        headers = {
            method: "POST",
            mode: "cors",
            headers:{
                "Authorization": token,
                "Notion-Version": NOTION_VERSION,
                // "Content-Type": "application/json",
                "Content-Type": "text/plain",
                // "Accept":"application/json",
                "Access-Control-Allow-Origin": "https://api.notion.com/",

            }
        }
        console.log(headers);
        fetch(url_notion, headers).then(response => {
            // }).then(response => response.json()).then((result) => {
            let c=1;
            console.log(response);
            console.log('it worked!');
        })
    });
}
