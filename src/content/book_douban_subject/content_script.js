function collect_to_notion() {
  let book_name = document.head.querySelector(
    "[property~='og:title'][content]"
  ).content;
  let url = document.head.querySelector(
    "[property~='og:url'][content]"
  ).content;
  let img = document.head.querySelector(
    "[property~='og:image'][content]"
  ).content;
  // let type = document.head.querySelector("[property~='og:type'][content]").content;
  let isbn = document.head.querySelector(
    "[property~='book:isbn'][content]"
  ).content;
  let ori_name = null;
  let publisher = null;
  let translator = null;
  let score = parseFloat(
    document.querySelector(
      "#interest_sectl > div > div.rating_self.clearfix > strong"
    ).textContent
  );
  let authors = new Array();
  document.head
    .querySelectorAll("[property~='book:author'][content]")
    .forEach(function (item) {
      authors.push(item.content.replace(/\s*$|^\s*/g, ""));
    });
  let description_arr = new Array();
  document
    .querySelector("div.intro")
    .querySelectorAll("p")
    .forEach(function (item) {
      description_arr.push(item.textContent.replace(/\s*$|^\s*/g, ""));
    });
  let description = description_arr.join("\n");

  let info = document.getElementById("info");
  let publishing_date = null;

  info.innerText
    .replace(/\s*$|^\s*/g, "")
    .split("\n")
    .forEach(function (item) {
      [key, val] = item.split(":");
      key = key.replace(/\s*$|^\s*/g, "");
      val = val.replace(/\s*$|^\s*/g, "");
      if (key == "出版社") {
        publisher = val;
      } else if (key == "原作名") {
        ori_name = val;
      } else if (key == "出版年") {
        publishing_date = val;
      } else if (key == "译者") {
        translator = val
          .split("/")
          .map((item) => item.replace(/\s*$|^\s*/g, ""));
      }
    });
  chrome.storage.sync.get("notion_book_database_id", ({ notion_book_database_id }) => {
    message = {
      cover: {
        type: "external",
        external: {
          url: img,
        },
      },
      icon: {
        type: "emoji",
        emoji: "📙",
      },
      parent: {
        database_id: notion_book_database_id,
      },
      properties: {
        Name: titleByStr(book_name),
        OriginName: textByStr(ori_name),
        Publisher: getSelect(publisher),
        Translator: multiseletByArr(translator),
        Authors: multiseletByArr(authors),
        Description: textByStr(description),
        ISBN: textByStr(isbn),
        PublicationTime: DateByISO8601(publishing_date),
        Link: getURL(url),
        Status: getSelect("Not started"),
        // "Tag": {},
        Score: getNumber(score),
      },
    };
    console.log(message);
    action = "addPage";
    chrome.runtime.sendMessage({ action, message }, (result) => {
      if (result['object'] == "page"){
        alert('收藏成功');
      }
      else {
        alert("收藏失败");
        console.error("result:", result);
      }
    });
  });
}

function init() {
  console.log("123456");
  let ul_ele = document.querySelector("#content > div > div.article > div.indent > div.gtleft > ul");
  let new_li = document.createElement("li");
  // new_li.innerHTML = '<img src="https://img3.doubanio.com/f/shire/5bbf02b7b5ec12b23e214a580b6f9e481108488c/pics/add-review.gif">&nbsp;<a id="collect-to-notion", class="" href="javascript:void(0);" onclick="collect_to_notion()"rel="toNotion">收藏到Notion</a>';
  new_li.innerHTML = '<img src="https://img3.doubanio.com/f/shire/5bbf02b7b5ec12b23e214a580b6f9e481108488c/pics/add-review.gif">&nbsp;<a id="collect-to-notion", class="" href="javascript:void(0);" rel="toNotion">收藏到Notion</a>';
  ul_ele.insertBefore(new_li, ul_ele.childNodes[4]);  
  let ele = document.getElementById("collect-to-notion");
  ele.addEventListener("click",  async () => collect_to_notion());
}
init();



