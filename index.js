// ==UserScript==
// @name         cbplus
// @namespace    https://github.com/valzar-cbp/
// @downloadURL  https://raw.githubusercontent.com/valzar-cbp/cbplus/master/index.js
// @version      1.2.0
// @description  Better Chaturbate!
// @author       ValzarMen
// @match      https://*chaturbate.com/*

// @require      https://raw.githubusercontent.com/Awakened-1/cbplus/master/video.min.js
// @require      https://raw.githubusercontent.com/Awakened-1/cbplus/master/jquery.min.js
// @require      https://raw.githubusercontent.com/Awakened-1/cbplus/master/jquery-ui.min.js
// @resource     vjCSS https://raw.githubusercontent.com/Awakened-1/cbplus/master/video-js.css
// @resource     jqCSS https://raw.githubusercontent.com/Awakened-1/cbplus/master/jquery-ui.css
// @resource     cbCSS https://raw.githubusercontent.com/Awakened-1/cbplus/master/cbplus.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// ==/UserScript==



GM_addStyle (GM_getResourceText("vjCSS"));
GM_addStyle (GM_getResourceText("jqCSS"));
GM_addStyle (GM_getResourceText("cbCSS"));

const globals = {};
//const allPaths = [];

let model_info;

function generalStuff() {
  globals.http = new XMLHttpRequest()

  let terms = document.querySelector('#close_entrance_terms')
  if (terms) terms.click() // just accept terms

  let pageTitle = document.querySelector("head > title").innerText;

  addTabs()
  cleanPage()

  globals.basePath = '/'
  globals.apiPath = '/api/'
  globals.camsPath = '/cams-cbplus/'
  globals.blackPath = '/cams-blacklist/'
  globals.whitePath = '/cams-whitelist/'
  globals.toursPath = '/tours/3/'
  globals.tagPath = '/tag/'
  globals.privatePath = '/spy-on-cams/'
  globals.femalePath = '/euro-russian-cams/female/'
  globals.newbiePath = '/new-cams/female/'
  globals.path = document.location.pathname
  //const allPaths = Object.values(globals);

   // alert(globals.tagsTab === globals.path);

  if (globals.path == globals.camsPath) {
      console.log("on cams path")
      camsSite()
     }
  else if (globals.path.slice(0,5) == globals.apiPath) {
      console.log("on API path")
      return}
  else if (document.location.pathname.toString().length < 2) {
      console.log("on base path")
      tagPage() }
  else if (globals.path == globals.blackPath) { blackSite() }
  else if (globals.path == globals.whitePath) whiteSite()
  else if (globals.path == globals.toursPath) toursPage()
  else if (globals.path == globals.femalePath) tagPage()
  else if (globals.path == globals.privatePath) spyPage()
  else if (pageTitle.slice(0,9) == "Chat with" ) {
      console.log("on model path")
      modelPage() }
  else if (globals.path.slice(0,5) == globals.tagPath) tagPage()
    else tagPage()
}

function camsSite() {
  const playerID = makeid(32)
  globals.chat = new BroadcastChannel(playerID)

  document.title = 'CBPlus Cams'
  let head = document.querySelector("#header")
  head.classList.add("header")

  document.body.innerHTML = "";
  document.body.style.height = '100vh'
  document.body.style.display = 'flex'
  document.body.style.flexDirection = 'column'
  document.body.appendChild(head)

  const body_main = document.createElement('div')
  body_main.style.display = 'flex'
  body_main.style.flexDirection = 'row'
  body_main.style.flex = '1'

  const main = document.createElement('div')
  main.setAttribute("id", "mainDiv")
  main.style.boxSizing = 'border-box'
  main.style.flex = '1'
  main.style.display = 'grid'
  main.className = 'oneCam'
  main.appendChild(camDiv())

  let rightMenu = document.createElement("div")
  rightMenu.setAttribute("id", "rightMenu")
  rightMenu.style.top = "0"
  rightMenu.style.bottom = "0"
  rightMenu.style.right = "0"
  rightMenu.style.width = "660px"
  rightMenu.style.display = 'flex'
  rightMenu.style.flexDirection = 'column'
  let frame = document.createElement("iframe")
  frame.src = 'https://chaturbate.com/tours/3/?p=1&c=200&playerID='+playerID
  frame.style.flex = '1'
  frame.style.border = '0'
  frame.style.width = "655px"

  let hideMenu = document.createElement("li");
  hideMenu.innerHTML = `<a style="color: gold;">        HIDE/SHOW LIST</a>`;
  hideMenu.style.cursor = 'pointer'
  hideMenu.onclick = function () { $('div#rightMenu').toggle(1000) }
  document.getElementById("nav").appendChild(hideMenu);

  rightMenu.appendChild(frame)
  body_main.appendChild(main)
  body_main.appendChild(rightMenu)
  document.body.appendChild(body_main)

  $('div#mainDiv').sortable({
    tolerance: "pointer",
    revert: true,
    stop: function (event, ui) { Dropped(event, ui) }
  })

  globals.chat.onmessage = readMessage
}

function Dropped(event, ui) {
  let player = ui.item[0].querySelector('video')
  if (player) player.play()
}

function blackSite() {
  document.title = 'CBPlus Blacklist'
  let mainD = document.getElementById("main");
  let body = mainD.getElementsByClassName("content_body")[0];
  let ul = document.createElement("ul");
  ul.id = "blacklist_ul";

  let TM_Storage = GM_listValues()
 //  console.log("TMStor: " + TM_Storage)
  let len = TM_Storage.length
  let keys = TM_Storage
  //console.log(keys)
  for (var i=0; i<len; i++) {

    if (!keys[i].includes('cbplus_blacklist_')) continue
    let li = document.createElement("li");
    let title = keys[i].substring(17)

    li.innerHTML = title + ", " + GM_getValue(keys[i]);
    li.onclick = function() {
      if (confirm('Are you sure you want to delete ' + this.innerHTML.split(",")[0] + ' from blacklist?')) {
        GM_deleteValue('cbplus_blacklist_' + this.innerHTML.split(",")[0]);
        //console.log(this.innerHTML + " is not longer on BLACKLIST");
        this.remove();
      } else {
        // Do nothing!
      }
    };
    li.style.cursor = 'pointer';
    li.onmouseover = function() {
      this.style.textDecoration = "line-through";
    };
    li.onmouseout = function() {
      this.style.textDecoration = "none";
    };
    ul.appendChild(li);
  }

  body.innerHTML = "";
  body.appendChild(ul);
//Sort the list
  var $ul = $('#blacklist_ul');
  var $lis = $ul.children('li');

  var sortList = Array.prototype.sort.bind($lis);
 sortList(function ( a, b ) {

    // Cache inner content from the first element (a) and the next sibling (b)
    var aText = a.innerHTML;
    var bText = b.innerHTML;

    // Returning -1 will place element `a` before element `b`
    if ( aText < bText ) {
        return -1;
    }

    // Returning 1 will do the opposite
    if ( aText > bText ) {
        return 1;
    }

    // Returning 0 leaves them as-is
    return 0;
});
    $ul.append($lis)

}

function whiteSite() {
  document.title = 'CBPlus whitelist'
  let mainD = document.getElementById("main");
  let body = mainD.getElementsByClassName("content_body")[0];
  let ul = document.createElement("ul");
  ul.id = "whitelist_ul";

  let TM_Storage = GM_listValues()
  let len = TM_Storage.length
  let keys = TM_Storage
  for (var i=0; i<len; i++) {
    if (!keys[i].includes('cbplus_whitelist_')) continue
    let li = document.createElement("li");
    let title = keys[i].substring(17)
    li.innerHTML = title + ", " + GM_getValue(keys[i]);
    li.onclick = function() {
      //if (confirm('Are you sure you want to delete ' + this.innerHTML.split(",")[0] + ' from whitelist?')) {
      //  localStorage.removeItem('cbplus_whitelist_' + this.innerHTML.split(",")[0]);
        GM_deleteValue('cbplus_whitelist_' + this.innerHTML.split(",")[0]);
        //console.log(this.innerHTML + " is not longer on BLACKLIST");
        this.remove();

     //} else {
        // Do nothing!
      //}
    };
    li.style.cursor = 'pointer';
    li.onmouseover = function() {
      this.style.textDecoration = "line-through";
    };
    li.onmouseout = function() {
      this.style.textDecoration = "none";
    };
    ul.appendChild(li);
  }

  body.innerHTML = "";
  body.appendChild(ul);
//Sort the list
    var $ul = $('#whitelist_ul');
  var $lis = $ul.children('li');

  var sortList = Array.prototype.sort.bind($lis);
 sortList(function ( a, b ) {

    // Cache inner content from the first element (a) and the next sibling (b)
    var aText = a.innerHTML;
    var bText = b.innerHTML;

    // Returning -1 will place element `a` before element `b`
    if ( aText < bText ) {
        return -1;
    }

    // Returning 1 will do the opposite
    if ( aText > bText ) {
        return 1;
    }

    // Returning 0 leaves them as-is
    return 0;
});
    $ul.append($lis)

}


function toursPage() {
  document.body.style.padding = '0 8px'
  addMiniButtons()
  setTimeout(function(){ window.location.reload(true); }, 48000);
  let playerID = document.location.search; playerID = playerID.substring(playerID.indexOf("playerID")).split("&")[0].split("=")[1]
  globals.chat = new BroadcastChannel(playerID)
}

function tagPage() {
  document.body.style.padding = '0 8px'
  addMiniButtons()
  setTimeout(function(){ window.location.reload(true); }, 120000);
  let playerID = document.location.search; playerID = playerID.substring(playerID.indexOf("playerID")).split("&")[0].split("=")[1]
  globals.chat = new BroadcastChannel(playerID)
}

function spyPage() {
  document.body.style.padding = '0 8px'
  addMiniButtons()
  setTimeout(function(){ window.location.reload(true); }, 120000);
 // let playerID = document.location.search; playerID = playerID.substring(playerID.indexOf("playerID")).split("&")[0].split("=")[1]
 // globals.chat = new BroadcastChannel(playerID)
}

function modelPage() {
  document.body.style.padding = '0 8px';
  addMiniButtons()
 // console.log("You must be on a model page")
}

function readMessage(msg) {
  let cmd = msg.data.split(" ")
  let check = document.body.querySelectorAll("div#mainDiv > div[name=\""+cmd[1]+"\"]")
  let wins = document.querySelectorAll("div#mainDiv > div.free")
  if (wins.length == 0 && !check.length) wins = addCamPlace()
  if (cmd[0] == "watch" && cmd[1].length > 0 && wins.length > 0 && !check.length) {
    globals.http.open('GET', `https://chaturbate.com/${cmd[1]}`, true)
    globals.http.setRequestHeader("Content-type","application/x-www-form-urlencoded")
    globals.http.onload = function() { addCam(globals.http.responseText, wins[0], cmd[1]) }
    globals.http.send()
  } else if (check.length) { console.log("already watching "+cmd[1]+"!") }
  else {
    //console.log("no free spots left!")
  }
}

function urlToName(input) {
  var output = input.substring(1);
  output = output.substring(0, output.search("/"));
  return output;
}

function cleanPage() {
  var Element = document.createElement("div");

  var ads = document.getElementsByClassName("remove_ads");
  if (ads.length > 0) ads[0].parentNode.remove();
  ads = document.getElementsByClassName("ad");
  if (ads.length > 0) ads[0].remove();

  var logo = document.getElementsByClassName("logo-zone");
  if (logo.length > 0) logo[0].parentNode.remove();

  Element.style.padding = "10px 0";
  var content = document.getElementsByClassName("content");
  if (content.length > 0) if (content[0].style.padding != Element.style.padding) content[0].style.padding = Element.style.padding;

  Element.style.margin = "0 10px";
  var c1Main = document.getElementsByClassName('c-1 endless_page_template');
  if (c1Main.length > 0) if (c1Main[0].style.margin != Element.style.margin) c1Main[0].style.margin = Element.style.margin;

  var c1 = document.getElementsByClassName("c-1");
  if (c1.length > 0) if (c1[0].style.margin != Element.style.margin) c1[0].style.margin = Element.style.margin;

  var blogPosts = document.getElementsByClassName('c-1 featured_blog_posts');
  if (blogPosts.length > 0) blogPosts[0].remove();
}

function addCamPlace() {
  let main = document.querySelector('div#mainDiv')
  let len = main.querySelectorAll('div.cam').length
  let loops = 0

  let mainClass = 'Cams35'
  if (len == 1) { loops = 1; mainClass = 'Cams2'}
  else if (len == 2) { loops = 1; mainClass = 'Cams3' }
  else if (len == 3) { loops = 1; mainClass = 'Cams4' }
  else if (len == 4) { loops = 1; mainClass = 'Cams5' }
  else if (len == 5) { loops = 1; mainClass = 'Cams6' }
  else if (len == 6) { loops = 3; mainClass = 'Cams9' }
  else if (len == 9) { loops = 3; mainClass = 'Cams12' }
  else if (len == 12) { loops = 4; mainClass = 'Cams16' }
  else if (len == 16) { loops = 4; mainClass = 'Cams20' }
  else if (len == 20) { loops = 5; mainClass = 'Cams25' }
  else if (len == 25) { loops = 5; mainClass = 'Cams30' }
  else if (len == 30) { loops = 5; mainClass = 'Cams35' }

  for (let i =0; i < loops; i++) main.appendChild(camDiv())

  main.className = mainClass
  return main.querySelectorAll("div.free")
}

function cleanCams() {
  let main = document.querySelector('div#mainDiv')
  let cams = main.querySelectorAll("div.free")
  let loops = 0

  for (let i =0; i < cams.length; i++) main.removeChild(cams[i])

  let len = main.querySelectorAll('div.cam').length

  let mainClass = 'oneCam'
  if (len > 30) { loops = 35-len; mainClass = 'Cams35' }
  else if (len > 25) { loops = 33-len; mainClass = 'Cams30' }
  else if (len > 20) { loops = 25-len; mainClass = 'Cams25' }
  else if (len > 16) { loops = 20-len; mainClass = 'Cams20' }
  else if (len > 12) { loops = 16-len; mainClass = 'Cams16' }
  else if (len > 9) { loops = 12-len; mainClass = 'Cams12' }
  else if (len > 6) { loops = 9-len; mainClass = 'Cams9' }
  else if (len > 5) { loops = 6-len; mainClass = 'Cams6' }
  else if (len > 4) { loops = 5-len; mainClass = 'Cams5' }
  else if (len > 3) { loops = 4-len; mainClass = 'Cams4' }
  else if (len > 2) { loops = 3-len; mainClass = 'Cams3' }
  else if (len > 1) { loops = 2-len; mainClass = 'Cams2' }
  else if (!len) { loops = 1 }

  for (let i =0; i < loops; i++) main.appendChild(camDiv())
  main.className = mainClass
}

function camDiv() {
  let c = document.createElement('div')
  c.classList = 'cam ui-sortable-handle free'
  c.appendChild(plusButton())
  return c
}

function addMiniButtons() {
  let rooms = document.querySelectorAll('ul.list > li')
  if (!rooms.length) return false

  for (let i=0; i < rooms.length; i++) {
    let name = rooms[i].querySelector('a').getAttribute('href').slice(1,-1)

    if (GM_getValue(`cbplus_blacklist_${name}`) != undefined) {
      rooms[i].style.display = "none"
      continue
    }
    let tmpLink = rooms[i].querySelector('div.title a')
    let tmpName = rooms[i].querySelector('div.title a').getAttribute("href").slice(1,-1)
    rooms[i].querySelector('a').removeAttribute("href")
    rooms[i].style.cursor = 'pointer'
    rooms[i].setAttribute('style', 'margin: 6px 6px')
    rooms[i].querySelector('a').setAttribute("name", tmpName)
    rooms[i].querySelector('a').onclick = function () { globals.chat.postMessage(`watch ${this.getAttribute("name")}`) }

       if (GM_getValue(`cbplus_whitelist_${name}`) != undefined) {
      rooms[i].querySelector('.details').setAttribute("style", "background-color: rgba(255, 255, 0, .4)")
    }
    rooms[i].querySelector('div.title a')

    tmpLink.setAttribute('target', '_blank')
    tmpLink.style.cursor = 'pointer'
    let buttonBlock = document.createElement('div')
    buttonBlock.style.top = '2px'
    buttonBlock.style.left = '2px'
    buttonBlock.style.position = 'absolute'
    buttonBlock.style.cursor = 'pointer'
    let buttonAdd = document.createElement('div')
    buttonAdd.style.top = '2px'
    buttonAdd.style.right = '2px'
    buttonAdd.style.position = 'absolute'
    buttonAdd.style.cursor = 'pointer'

    let blockButton = document.createElement('div')
    blockButton.innerHTML = '⛔'
    blockButton.setAttribute("name", tmpName)
    blockButton.onclick = function () {
      let cam = this.parentNode.parentNode
      let name = this.getAttribute("name")
      if (GM_getValue(`cbplus_whitelist_${name}`)) {
          GM_deleteValue(`cbplus_whitelist_${name}`);
         cam.querySelector('.details').setAttribute("style", "background-color: rgb(255, 255, 255)")
         return;
          }
      //if (confirm('Are you sure you want to add ' + name + ' to blacklist?')) {
        let gender = cam.querySelector('div.title span').className.substr(-1)
        let age = cam.querySelector('div.title span').innerHTML;
        let value = gender + " " + age + " added: " + new Date().toLocaleString();
        cam.style.display = "none";
        localStorage.setItem(`cbplus_blacklist_${name}`, value);
        GM_setValue(`cbplus_blacklist_${name}`, value)
     // }
    }
    buttonBlock.appendChild(blockButton)

    let streamButton = document.createElement('div')
    streamButton.innerHTML = '↗️'
    streamButton.setAttribute("name", tmpName)
    streamButton.onclick = function () {
   // e.preventDefault()
    openStream(name)
    }

    buttonBlock.appendChild(streamButton)
     let addButton = document.createElement('div')
    addButton.innerHTML = '❤️'
    addButton.setAttribute("name", tmpName)
    addButton.onclick = function () {
      let cam = this.parentNode.parentNode
      let name = this.getAttribute("name")
        let gender = cam.querySelector('div.title span + span').className.substr(-1)
        let age = cam.querySelector('div.title span').innerHTML;
        let value = gender + " " + age + " added: " + new Date().toLocaleString();
        cam.querySelector('.details').setAttribute("style", "background-color: rgba(255, 255, 0, .4)");
      //  localStorage.setItem(`cbplus_whitelist_${name}`, value);
        GM_setValue(`cbplus_whitelist_${name}`, value);
     // }
    }
    buttonAdd.appendChild(addButton);

    let tempViewers = rooms[i].querySelector('div.details > ul.sub-info > li.cams').textContent;
    let viewers = Number(tempViewers.slice(tempViewers.indexOf(',') +1, tempViewers.indexOf(' view')).trim() );
//************$$$$$$$%%%%%%%%%%%%%%%%%%%************$$$$$$$%%%%%%%%%%%%%%%%%%%************$$$$$$$%%%%%%%%%%%%%%%%%%%************$$$$$$$%%%%%%%%%%%%%%%%%%%************$$$$$$$%%%%%%%%%%%%%%%%%%%************$$$$$$$%%%%%%%%%%%%%%%%%%%
//************$$$$$$$%%%%%%%%%%%%%%%%%%%************$$$$$$$%%%%%%%%%%%%%%%%%%%************$$$$$$$%%%%%%%%%%%%%%%%%%%************$$$$$$$%%%%%%%%%%%%%%%%%%%************$$$$$$$%%%%%%%%%%%%%%%%%%%************$$$$$$$%%%%%%%%%%%%%%%%%%%
//************$$$$$$$%%%%%%%%%%%%%%%%%%%************$$$$$$$%%%%%%%%%%%%%%%%%%%************$$$$$$$%%%%%%%%%%%%%%%%%%%************$$$$$$$%%%%%%%%%%%%%%%%%%%************$$$$$$$%%%%%%%%%%%%%%%%%%%************$$$$$$$%%%%%%%%%%%%%%%%%%%
  //  if (viewers < 5 || viewers > 20) rooms[i].style.display = "none";
    if ( (globals.path == globals.privatePath) || ( globals.path == globals.newbiePath ) ) {rooms[i].style.display = "block";}
    else if ( viewers < 5 && globals.path != globals.privatePath) rooms[i].style.display = "none";

    let gender = rooms[i].querySelector('div.age_gender_container span + span').className.substr(-1);
    let age = rooms[i].querySelector('div.title span').innerHTML;
    let tags = rooms[i].querySelector('div.details ul.subject li').innerText.toString().toLowerCase();
    tags += rooms[i].textContent.toString().toLowerCase();
    //tags += rooms[i].querySelector('div.details ul.subject li a').innerText.toString().toLowerCase();
 //   let tags = rooms[i].querySelector('li > div.details > ul.subject > li.title').innerHTML;
    //  console.log(tags);
    if ( (tags.indexOf("#asian") > 0 ) || (tags.indexOf("#pregnant") > 0 ) ) {
        rooms[i].style.display = "none";
    }
      if (tags.indexOf("#bigboobs") > 0 && tags.indexOf("#natural") > 0 ) {
          var roomDetails = rooms[i].querySelector('.details');
          roomDetails.style.background = "rgba(51, 53, 255, .4)";
          roomDetails.style.fontWeight = "900";
          rooms[i].style.border = '1px solid black';
      }


    if ( rooms[i].querySelector('li > div.thumbnail_label.thumbnail_label_c_new')) {
      rooms[i].querySelector('.details').setAttribute("style", "background-color: rgba(107, 165, 49, .4)");
    };
    if ( GM_getValue(`cbplus_whitelist_${name}`) != undefined) {
      rooms[i].querySelector('.details').setAttribute("style", "background-color: rgba(255, 255, 0, .4)");
    };
    let ageLimit = 35;
//      console.log("tags: " + tags)
   // if (tags.indexOf("#asian") > -1) rooms[i].style.display = "none";//
    if (Number(age) >= ageLimit && Number(age) < 65) rooms[i].style.display = "none";//
    if (gender == 'm' || gender == 's' || gender == 'c') rooms[i].style.display = "none";
    else (rooms[i].appendChild(buttonBlock))
      rooms[i].appendChild(buttonAdd)

  }
}

function addTabs() {


  var sub_nav = document.getElementById("nav");
    if (sub_nav) {
     document.querySelector("div.nav-bar").style.height = "auto"


    // cams Tab
    var camsTab = document.createElement("li");
    camsTab.innerHTML = `<a style="color: gold;" href=\"/cams-cbplus/\">CBPLUS</a>`;
    sub_nav.appendChild(camsTab);

//    var tagsTab = document.createElement("li");
//    tagsTab.innerHTML = `<a style="color: gold;" href=\"/tags-tab/\">Tags Tab</a>`;
//    sub_nav.appendChild(tagsTab);

    // blacklist Tab
    let blackTab = document.createElement("li");
    blackTab.innerHTML = `<a href=\"/cams-blacklist/\">BLACKLIST</a>`;
    sub_nav.appendChild(blackTab);
    let whiteTab = document.createElement("li");
    whiteTab.innerHTML = `<a href=\"/cams-whitelist/\">WHITELIST</a>`;
    sub_nav.appendChild(whiteTab);
    // Selector Dropdown
  //  addDropdown2();
    var head = sub_nav.parentNode.parentNode;
        head.style.position = 'sticky';
        head.style.top = 0;
        head.style.zIndex = 500;
  }
}



function makeid(length) {
   var result = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function addCam(resp, div, model) {
  let pos1 = resp.search('https://edge')
  let pos2 = resp.search('.m3u8')+5
  let stream = ''
  if (resp.includes('.m3u8')) { stream = resp.substring(pos1, pos2).replace(/\\u002D/g, '-') }
  else { stream = 'no data' }
  let poster = 'https://cbjpeg.stream.highwebmedia.com/stream?room='+model+'&f='+Math.random()
  let id = 'cam'+Math.floor(Math.random()*10000)
  div.classList.remove('free')

  div.setAttribute("name", model)
  div.innerHTML = `<video style="width: 100%; height: 100%;" id="${id}" class="video-js" poster="${poster}">
                   <source src="${stream}" type=""application/x-mpegURL""></source></video>`
  div.appendChild(topButtons(model))
  const player = videojs(id, { controls: true, autoplay: true, preload: 'auto', fluid: false, enableLowInitialPlaylist: true })
  player.volume(0.00)

}

function refreshCam(div) {
  div.innerHTML = ''
  div.classList.add('free')
  console.dir(div)
  let model_name = div.getAttribute("name")
  div.removeAttribute("name")
  globals.http.open('GET', `https://chaturbate.com/${model_name}`, true)
  globals.http.setRequestHeader("Content-type","application/x-www-form-urlencoded")
  globals.http.onload = function() { addCam(globals.http.responseText, div, model_name) }
  globals.http.send()
}

function removeCam(div) {
  div.innerHTML = ''
  div.classList.add('free')
  div.removeAttribute("name")
  div.appendChild(plusButton())
  cleanCams()
}


function plusButton() {
  let b = document.createElement('button')
  b.innerHTML = 'ADD'
  b.classList.add('plusButton')
  b.addEventListener('click', e => {
      e.preventDefault()
      let user_data = prompt(`Enter cb model name:`, '')
      if (user_data !== null) {
        user_data = user_data.trim()
        if (user_data.includes('/') || user_data.includes('chaturbate.com')) {
          user_data = user_data.split('/').filter(Boolean).pop()
        }
        globals.http.open('GET', `https://chaturbate.com/${user_data}`, true)
        globals.http.setRequestHeader("Content-type","application/x-www-form-urlencoded")
        globals.http.onload = function() { addCam(globals.http.responseText, e.path[1], user_data) }
        globals.http.send()
      }
    })
  return b
}


function getModelInfo() {
  let model_info = globals.http.responseText.toString();
//var stopKey = ', \u0022broadcaster_on_new_chat'
var start = model_info.indexOf('viewers')
//var stop = model_info.indexOf(stopKey)
var viewers = model_info.substring(start +15, start +20)//.trim()
 //   console.log(viewers)
    return viewers
}

function topButtons(name) {
  let top = document.createElement('div')
  top.classList.add('topFrame')

  let numUsers = document.createElement('span')
  numUsers.innerText = 'Viewers: ' + getModelInfo();
  numUsers.classList.add('topButton')
//console.log(numUsers.innerText)
  let h = document.createElement('button')
  h.innerHTML = '❤️'
  h.classList.add('topButton')
  let p = document.createElement('button')
  p.innerHTML = 'Get Stream ↗️ '
  p.classList.add('topButton')
  let r = document.createElement('button')
  r.innerHTML = name+' 🔄'
  r.classList.add('topButton')
  let x = document.createElement('button')
  x.innerHTML = '❌'
  x.classList.add('topButton')
  top.appendChild(h);
  h.addEventListener('click', e => {
    e.preventDefault();
   // let cam = this.parentNode.parentNode;
   // let name = e.getAttribute("name");
   //   console.log("The Name:  " + e.toString());
//    let gender = cam.querySelector('div.title span + span').className.substr(-1)
//    let age = cam.querySelector('div.title span').innerHTML;
//    let value = gender + " " + age + " added: " + new Date().toLocaleString();
//      cam.querySelector('.details').setAttribute("style", "background-color: rgba(255, 255, 0, .4)");
      GM_setValue(`cbplus_whitelist_${name}`, new Date().toLocaleString());
  })

    top.appendChild(p)
  p.addEventListener('click', e => {
    e.preventDefault()
    openStream(name)
  })
    top.appendChild(r)
    top.appendChild(numUsers)
  r.addEventListener('click', e => {
    e.preventDefault()
    refreshCam(e.path[2])
  })
  top.appendChild(x)
  x.addEventListener('click', e => {
    e.preventDefault()
    removeCam(e.path[2])
  })
  return top
}

async function openStream(name) {
    window.open(`https://chaturbate.com/api/chatvideocontext/${name}/ `,"_blank",'scrollbars=yes,menubar=yes, toolbar=yes,location=yes,addressbar=yes,width=780px,height=670px')
}



//addToLocalStorage()
generalStuff()
//checkStatus()
