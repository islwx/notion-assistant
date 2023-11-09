function dow() {
  'use strict';
  // find the title
  var title = document.getElementsByClassName("title mathjax")[0].innerText;
  //find where to put the tag
  var loc = document.getElementsByClassName("full-text")[0].getElementsByTagName('ul');
  var obj = document.createElement("li");
  //get the pdf url
  var url = document.getElementsByClassName("full-text")[0].getElementsByTagName('a')[0].href;
  //var getUrlHttp = new XMLHttpRequest();
  //getUrlHttp.open('GET', url, true);
  //getUrlHttp.send(null);
  //var res = getUrlHttp.responseText;
  //var myRex = /(http:\/\/ieee[^"]+)/;
  //var pdfurl = res.match(myRex)[0];
  let pdfurl = url;
  if (!pdfurl.endsWith(".pdf")) {
   pdfurl = url + '.pdf';
  }
  let ori_name= document.location.href.split("/")[4];
  var fileName = `[${ori_name}]` + title.toString().replace(": "," -- ") + '.pdf';
  obj.innerHTML = '<a download='+ '"'+ fileName + '"' + ' href=' + `/pdf/${ori_name}` +'>Save as pdf</a>';
  //loc.insertBefore(obj, loc.childNodes[0]);
  loc[0].insertBefore(obj, loc[0].childNodes[0]);
};

function collect_to_notion() {
  let title = document.head.querySelector(
    "head > title"
  ).textContent;
  let paper_title = document.getElementsByClassName(
    "title mathjax"
  )[0].innerText;
  let introduction = document.getElementsByClassName(
    "abstract mathjax"
  )[0].innerText;
  let authors = new Array();
  document.body
  .querySelectorAll("#abs > div.authors > a")
  .forEach(function (item) {
    authors.push(item.textContent.replace(/\s*$|^\s*/g, ""));
  });
  
  let url = document.head.querySelector(
    "[property~='og:url'][content]"
  ).content;

  let status = 'Not started';
  let published = 'arxiv';
  let published_date = document.head.querySelector("[name~='citation_online_date'][content]").content;
  let icon = document.head.querySelector("link[rel*='apple-touch-icon']").href;
  let subjects = new Array();
  document.body
  .getElementsByClassName("tablecell subjects")[0]
  .innerText
  .split("; ")
  .forEach(function (item){
    subjects.push(item.replaceAll(",", "，"));  // notion don't suppose "," at select
    
  });
  let remark = null;
  comment_objs = document.body.getElementsByClassName("tablecell comments mathjax")
  if (comment_objs.length>0){
    remark = comment_objs[0].innerText;
  }
  
  chrome.storage.sync.get("notion_paper_database_id", ({ notion_paper_database_id }) => {
    message = {
      // cover: null,
      icon: {
        type: "external",
        external: {
          "url":icon
        },
      },
      parent: {
        database_id: notion_paper_database_id,
      },
      properties: {
        Name: titleByStr(title),
        PaperTitle: textByStr(paper_title),
        Introduction: textByStr(introduction),
        Authors: multiseletByArr(authors),
        Published: getSelect(published),
        PublishedDate: DateByISO8601(published_date),
        Status: getSelect(status),
        Link: getURL(url),
        Subjects: multiseletByArr(subjects),
        Remark: textByStr(remark),
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
  let ul_ele = document.getElementsByClassName("full-text")[0].getElementsByTagName('ul')[0];
  let new_li = document.createElement("li");
  // new_li.innerHTML = '<img src="https://img3.doubanio.com/f/shire/5bbf02b7b5ec12b23e214a580b6f9e481108488c/pics/add-review.gif">&nbsp;<a id="collect-to-notion", class="" href="javascript:void(0);" onclick="collect_to_notion()"rel="toNotion">收藏到Notion</a>';
  new_li.innerHTML = '<a id="collect-to-notion", href="javascript:void(0);" rel="toNotion">Collect to Notion</a>';
  ul_ele.insertBefore(new_li, ul_ele.childNodes[0]);  
  let ele = document.getElementById("collect-to-notion");
  ele.addEventListener("click",  async () => collect_to_notion());
}
init();



