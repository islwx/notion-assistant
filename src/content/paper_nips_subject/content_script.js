function dowload() {
  let published_date = document.head.querySelector("[name~='citation_publication_date'][content]").content;
  let title = document.head.querySelector("[name~='citation_title'][content]").content;
  //find where to put the tag
  var loc = document.getElementById("navbarToggler6").getElementsByTagName('ul')[0];
  var obj = document.createElement("li");
  obj.classList.add("nav-item");
  //get the pdf url 
  var url = document.head.querySelector("[name~='citation_pdf_url'][content]").content;
  let pdfurl = url;
  if (!pdfurl.endsWith(".pdf")) {
   pdfurl = url + '.pdf';
  }
  var fileName = '[NIPS.' +published_date + ']' + title.toString().replace(": "," -- ") + '.pdf';
  obj.innerHTML = '<a download='+ '"'+ fileName + '"' + ' href=' + `${pdfurl}` +'>Save as pdf</a>';
  // loc.insertBefore(obj, loc.childNodes[0]);
  loc.insertBefore(obj, loc.childNodes[-1]);
};

function getElementByXpath(xpath){
	var element = document.evaluate(xpath,document).iterateNext();
	return element;
}

function collect_to_notion() {
  let published_date = document.head.querySelector("[name~='citation_publication_date'][content]").content;
  let title = '[NIPS.' +published_date + ']' +  document.head.querySelector("[name~='citation_title'][content]").content;
  let paper_title = document.head.querySelector("[name~='citation_title'][content]").content;
  let introduction = getElementByXpath(
    "/html/body/div[2]/div/p[4]"
  ).innerText;
  let authors = new Array();
  getElementByXpath(
    "/html/body/div[2]/div/p[2]/i"
  ).innerText
  .split(',')
  .forEach(function (item) {
    authors.push(item.replace(/\s*$|^\s*/g, ""));
  });
  
  let url = document.location.href;

  let status = 'Not started';
  let published = getElementByXpath(
    "/html/body/div[2]/div/p[1]/a"
  ).innerText;
  let icon = null;
  let subjects = null;
  let remark = null;
  
  chrome.storage.sync.get("notion_paper_database_id", ({ notion_paper_database_id }) => {
    message = {
      // cover: null,
      icon: {
        type: "emoji",
        emoji: "📜",
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
  let ul_ele = document.getElementById("navbarToggler6").getElementsByTagName('ul')[0];
  let new_li = document.createElement("li");
  new_li.classList.add("nav-item")
  // new_li.innerHTML = '<img src="https://img3.doubanio.com/f/shire/5bbf02b7b5ec12b23e214a580b6f9e481108488c/pics/add-review.gif">&nbsp;<a id="collect-to-notion", class="" href="javascript:void(0);" onclick="collect_to_notion()"rel="toNotion"></a>';
  new_li.innerHTML = '<a id="collect-to-notion" class="nav-link" href="javascript:void(0);" rel="toNotion">Collect to Notion</a>';
  ul_ele.insertBefore(new_li, ul_ele.childNodes[-1]);  
  let ele = document.getElementById("collect-to-notion");
  ele.addEventListener("click",  async () => collect_to_notion());
  dowload();
}
init();



