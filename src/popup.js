// Initialize button with user's preferred color
(async () => {
    const src = chrome.runtime.getURL("notion_obj.js");
    const contentMain = await import(src);
    console.log(contentMain.textByStr("123"));
  })();

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

        chrome.storage.sync.get("notion_databse_id", ({ notion_databse_id }) => {
            message = {
                "parent": {
                    "database_id": notion_databse_id,
                },
                "properties": {
                    "Name": titleByStr(book_name),
                    "OriginName": textByStr(origin_name),
                    "Publisher": getSelect(publisher),
                    "Translator": mulseletByArr(translator),
                    "Authors": mulseletByArr(authors),
                    "Description": textByStr(description),
                    "ISBN": textByStr(isbn),
                    "PublicationTime": DateByISO8601(publishing_date),
                    "Status": getSelect("Not started"),
                    // "Tag": {},
                    // "Score": {},
                },
            }
            console.log(messages);
            action = "addPage";
            chrome.runtime.sendMessage({ action, message }, result => {
                console.log(result);
            });
        })

    };
}

