// ./src/index/css.js
new CssFile('hover-resource', 'hover-explanation {   border-radius: 10pt;   background-color: rgba(150, 162, 249, 0.56); }  hover-explanation:hover {   font-weight: bolder; }  .ce-hover-max-min-cnt {   position: fixed; }  .ce-hover-max-min-abs-cnt {   position: absolute;   right: 22px;   z-index: 2; }  .ce-upper-right-btn {   padding: 0 5px;   border-radius: 3px;   margin: 1px;   background-color: transparent;   color: black;   border-color: gray;   border-width: .5px;   background-color: whitesmoke; }  #ce-hover-display-cnt-id {   padding: 0 10pt;   width: 100%; }  #ce-hover-switch-list-id {   margin: 0; }  .ce-hover-list {   list-style: none;   font-size: medium;   color: blue;   font-weight: 600;   padding: 0 10pt; }  .ce-hover-list.active {   background-color: #ada5a5;   border-radius: 10pt; }  .arrow-up {   width: 0;   height: 0;   border-left: 10px solid transparent;   border-right: 10px solid transparent;    border-bottom: 15px solid black; }  .arrow-down {   width: 0;   height: 0;   border-left: 20px solid transparent;   border-right: 20px solid transparent;    border-top: 20px solid #f00; }  .arrow-right {   width: 0;   height: 0;   border-top: 60px solid transparent;   border-bottom: 60px solid transparent;    border-left: 60px solid green; }  .arrow-left {   width: 0;   height: 0;   border-top: 10px solid transparent;   border-bottom: 10px solid transparent;    border-right:10px solid blue; }  #event-catcher-id {   position: fixed;   top: 0;   bottom: 0;   right: 0;   left: 0; }  .pop-out {   border: 1px solid;   border-radius: 5pt;   padding: 10px;   box-shadow: 3px 3px 6px black, 3px 3px 6px grey, 3px 3px 6px lightgrey; } ');

new CssFile('index', '.ce-history-list {   list-style: none;   margin: 0;   padding: 0; }  .ce-history-list>li {   padding: 0 10pt;   font-weight: bolder; }  .ce-history-list>li.place-current-hist-loc {   border-style: solid;   border-width: .5px; }  .ce-history-list>li:hover {   padding: 0 10pt;   background-color: #a9a9a973;   border-radius: 10pt; }  .ce-relative {   position: relative; }  .ce-width-full {   width: 100%; }  .ce-pointer {   cursor: pointer; }  .ce-pointer:hover {   background-color: #8080802e;   border-radius: 40pt; }  .ce-overflow {   overflow: auto; }  .ce-full {   width: 100%;   height: 100%; }  .ce-fixed {   position: fixed; }  .ce-error {   color: red; }  .ce-padding {   padding: 5px; }  .ce-center {   text-align: center;   width: 100%; }  .ce-float-right {   float: right; }  .ce-no-bullet {   list-style: none; }  .ce-inline {   display: inline-flex; }  button {   background-color: blue;   color: white;   font-weight: bolder;   font-size: medium;   border-radius: 20pt;   padding: 4pt 10pt;   border-color: #7979ff; }  input {   padding: 1pt 3pt;   border-width: 1px;   border-radius: 5pt; } ');

new CssFile('lookup', '.ce-tab-ctn {   text-align: center;   display: inline-flex;   width: 100%; }  .ce-lookup-cnt {   width: 100%;   padding: 5pt;   padding-left: 50pt; }  .ce-lookup-expl-list-cnt {   min-height: 100pt;   overflow: auto; }  .ce-tabs-list {   display: block;   list-style-type: none;   width: max-content;   margin: auto;   padding: 0;   margin-right: 5pt; }  .ce-tabs-list-item {   padding: 4pt;   border-style: solid;   border-width: 1px;   border-radius: 10px;   margin: 2pt;   font-weight: bolder;   border-color: gray;   box-shadow: 1px 1px 2px black;   }  .ce-tabs-active {     background-color: gainsboro;     box-shadow: 0 0 0 black;   }  .ce-expl-card {   display: flex;   position: relative;   border: solid;   text-align: left;   border-width: 1px;   border-radius: 10px;   margin: 5px 0px;   border-color: grey;   box-shadow: 1px 1px 1px grey; }  .ce-expl-rating-column {   min-height: 70pt;   float: left;   padding: 2pt;   border-right: ridge;   border-color: black;   border-width: 1pt; }  .ce-expl-rating-cnt {   transform: translateY(-50%);   position: absolute;   top: 50%; }  .ce-like-btn {   width: 0;   height: 0;   border-color: transparent;   border-right: 10px solid transparent;   border-left: 10px solid transparent;   border-bottom: 10px solid #3dd23d;   cursor: pointer;   background-color: transparent;   border-radius: 0;   margin: 0;   padding: 0; } .ce-like-btn:disabled {   border-bottom: 10px solid grey; }  .ce-hover-expl-title-cnt {   display: inline-flex;   width: 100%;   text-align: center; }  .ce-dislike-btn {   width: 0;   height: 0;   border-color: transparent;   border-right: 10px solid transparent;   border-left: 10px solid transparent;   border-top: 10px solid #f74848;   cursor: pointer;   background-color: transparent;   border-radius: 0;   margin: 0;   padding: 0; }  .ce-dislike-btn:disabled {   border-top: 10px solid grey; }  .ce-expl-tag-cnt > span {   display: inline-flex;   margin: 0 5pt; }  .ce-small-text {     color: black;     font-size: x-small; }  .ce-add-editor-cnt {   width: 100%;   display: inline-flex; }  #ce-add-editor-id {   width: 98%;   height: 85%;   margin: 1%; }  #ce-add-editor-add-expl-btn-id {   margin: 0 0 0 10pt;   font-size: x-small;   top: 50%;   transform: translate(0, 25%); }  .ce-expls-cnt {   border: solid;   border-width: 1px;   border-radius: 10px;   margin: 5px 0px;   border-color: grey;   box-shadow: 1px 1px 1px grey;   padding: 5pt; }  .ce-apply-expl-btn-cnt {   position: relative;   width: 5%; }  .ce-expl-apply-btn {   position: relative;   top: 50%;   transform: translate(0, -50%); }  .ce-expl-apply-btn:disabled {     background-color: grey;     border-color: darkgray; }  .ce-expl-apply-cnt {   position: relative;   padding: 5px;   text-align: center;   border-right: black;   border-style: solid;   border-width: 0 1px 0 0; }  .ce-expl-cnt {   float: right;   padding: 0;   width: 100%;   display: inline-flex; }  .ce-expl {   padding: 2pt;   display: inline-flex;   width: inherit;   overflow-wrap: break-word; }  .ce-expl-card > .tags {   font-size: small;   color: grey; }    .ce-wiki-frame {      width: -webkit-fill-available;        height: -webkit-fill-available;   }    #ce-tag-input {       width: 50%;     margin-bottom: 10pt;     padding: 2pt;     border-radius: 10pt;     border-width: 1px;     border-color: gainsboro;   }    .ce-btn {     box-shadow: 1px 1px 1px grey;     border-style: solid;     border-width: 1px;     margin: 10px;     border-radius: 20px;     padding: 5px 15px;     background-color: white; }  #ce-lookup-header-padding-id {   padding-top: 60pt; }  .ce-merriam-header-cnt {   background-color: white;   min-height: 25px;   text-align: center;   width: 100%; }  .ce-lookup-expl-heading-cnt {   background-color: white;   z-index: 1000000000;   width: fit-content; }  .ce-key-cnt {   display: inline-flex; }  .ce-add-btn {     padding: 0 8px;     font-weight: bolder;     font-size: x-large;     color: green;     border-color: green;     box-shadow: 1px 1px 1px green; }  .ce-words-search-input {   font-size: x-large !important; }  .ce-words-search-btn {   padding: 0 8px;   margin: 0 20pt; }  .lookup-img {   width: 30pt; }  .ce-merriam-cnt {   text-align: center;   position: relative;   border: solid;   border-width: 1px;   border-radius: 10px;   margin: auto;   border-color: grey;   box-shadow: 1px 1px 1px grey; }  .ce-merriam-expl-card {   padding: 0 10px;   position: relative;   border: solid;   border-width: 1px;   border-radius: 10px;   margin: auto;   border-color: grey;   box-shadow: 1px 1px 1px grey; }  .ce-merriam-expl {   text-align: left; }  .ce-merriam-expl-cnt {   width: fit-content;   margin: auto; }  .ce-margin {   margin: 3pt; }  .ce-linear-tab {   font-size: 12pt;   padding: 0pt 5pt;   border-style: ridge;   border-radius: 10pt;   margin: 1pt 1pt;   display: inline-block;   white-space: nowrap; }  .ce-inline-flex {   display: inline-flex; }  #merriam-webster-submission-cnt {   margin: 2pt;   text-align: center;   display: flex;   overflow: scroll; } ');

new CssFile('menu', 'menu {   display: grid;   padding: 5px; }  menuitem:hover {   background-color: #d8d8d8; } ');

new CssFile('place', '.place-history-cnt {   background: white;   width: fit-content;   height: fit-content;   border-style: groove;   border-radius: 10pt; }  .place-btn {   padding: 0 5px;   border-radius: 3px;   margin: 2px;   background-color: transparent;   color: black;   border-color: gray;   border-width: .5px;   background-color: whitesmoke; }  .place-right {   float: right; }  .place-left {   float: left; }  .pop-out {   border: 1px solid;   border-radius: 5pt;   padding: 10px;   box-shadow: 3px 3px 6px black, 3px 3px 6px grey, 3px 3px 6px lightgrey; }  .place-max-min-cnt {   display: grid;   position: absolute;   top: 0;   right: 1%;   z-index: 100; }  .place-inline {   display: inline-flex; }  .place-full-width {   width: 100%; } ');

new CssFile('popup', '.ce-popup {   border: 1px solid;   border-radius: 5pt;   padding: 10px;   box-shadow: 3px 3px 6px black, 3px 3px 6px grey, 3px 3px 6px lightgrey; }  .ce-popup-shadow {   position: fixed;   left: 0;   top: 0;   width: 100%;   height: 100%;   text-align: center;   background:rgba(0,0,0,0.6);   padding: 20pt; } ');

new CssFile('settings', ' body {   height: 100%;   position: absolute;   margin: 0;   width: 100%; }  #ce-logout-btn {   position: absolute;   right: 50%;   bottom: 50%;   transform: translate(50%, 50%); }  #ce-profile-header-ctn {   display: inline-flex;   position: relative;   width: 100%; }  #ce-setting-cnt {   display: inline-flex;   height: 100%;   width: 100%; } #ce-setting-list {   list-style-type: none;   padding: 5pt; }  #ce-setting-list-cnt {   background-color: blue;   position: fixed;   height: 100vh; }  .ce-setting-list-item {   font-weight: 600;   font-size: medium;   color: aliceblue;   margin: 5pt 0;   padding: 0 10pt;   width: max-content; }  .ce-error-msg {   color: red; }  .ce-active-list-item {   background: dodgerblue;   border-radius: 15pt; }  #ce-login-cnt {   text-align: center;   width: 100%;   height: 100vh; }  #ce-login-center {   position: relative;   top: 50%;   transform: translate(0, -50%); } ');

new CssFile('text-to-html', '#raw-text-input {   min-height: 100vh;   width: 100%;   -webkit-box-sizing: border-box;    -moz-box-sizing: border-box;    /* Firefox, other Gecko */   box-sizing: border-box; } ');
