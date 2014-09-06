/*
	[Discuz!] (C)2001-2009 Comsenz Inc.
	This is NOT a freeware, use is subject to license terms

	$Id: home.js 16010 2010-08-31 00:34:55Z monkey $
*/

var note_step = 0;
var note_oldtitle = document.title;
var note_timer;

function addSort(obj) {
	if (obj.value == 'addoption') {
		showWindow('addoption', 'home.php?mod=spacecp&ac=blog&op=addoption&handlekey=addoption&oid='+obj.id);
 	}
}

function addOption(sid, aid) {
	var obj = document.getElementById(aid);
	var newOption = document.getElementById(sid).value;
	document.getElementById(sid).value = "";
	if (newOption!=null && newOption!='') {
		var newOptionTag=document.createElement('option');
		newOptionTag.text=newOption;
		newOptionTag.value="new:" + newOption;
		try {
			obj.add(newOptionTag, obj.options[0]);
		} catch(ex) {
			obj.add(newOptionTag, obj.selecedIndex);
		}
		obj.value="new:" + newOption;
	} else {
		obj.value=obj.options[0].value;
	}
}

function blogAddOption(sid, aid) {
	var obj = document.getElementById(aid);
	var newOption = document.getElementById(sid).value;
	newOption = newOption.replace(/^\s+|\s+$/g,"");
	document.getElementById(sid).value = "";
	if (newOption!=null && newOption!='') {
		var newOptionTag=document.createElement('option');
		newOptionTag.text=newOption;
		newOptionTag.value="new:" + newOption;
		try {
			obj.add(newOptionTag, obj.options[0]);
		} catch(ex) {
			obj.add(newOptionTag, obj.selecedIndex);
		}
		obj.value="new:" + newOption;
		return true;
	} else {
		alert('分类名不能为空！');
		return false;
	}
}

function blogCancelAddOption(aid) {
	var obj = document.getElementById(aid);
	obj.value=obj.options[0].value;
}

function checkAll(form, name) {
	for(var i = 0; i < form.elements.length; i++) {
		var e = form.elements[i];
		if(e.name.match(name)) {
			e.checked = form.elements['chkall'].checked;
		}
	}
}

function cnCode(str) {
	str = str.replace(/&|<|"|>/ig, '', str);
	return BROWSER.ie && document.charset == 'utf-8' ? encodeURIComponent(str) : str;
}

function getExt(path) {
	return path.lastIndexOf('.') == -1 ? '' : path.substr(path.lastIndexOf('.') + 1, path.length).toLowerCase();
}

function resizeImg(id,size) {
	var theImages = document.getElementById(id).getElementsByTagName('img');
	for (i=0; i<theImages.length; i++) {
		theImages[i].onload = function() {
			if (this.width > size) {
				this.style.width = size + 'px';
				if (this.parentNode.tagName.toLowerCase() != 'a') {
					var zoomDiv = document.createElement('div');
					this.parentNode.insertBefore(zoomDiv,this);
					zoomDiv.appendChild(this);
					zoomDiv.style.position = 'relative';
					zoomDiv.style.cursor = 'pointer';

					this.title = '点击图片，在新窗口显示原始尺寸';

					var zoom = document.createElement('img');
					zoom.src = 'image/zoom.gif';
					zoom.style.position = 'absolute';
					zoom.style.marginLeft = size -28 + 'px';
					zoom.style.marginTop = '5px';
					this.parentNode.insertBefore(zoom,this);

					zoomDiv.onmouseover = function() {
						zoom.src = 'image/zoom_h.gif';
					};
					zoomDiv.onmouseout = function() {
						zoom.src = 'image/zoom.gif';
					};
					zoomDiv.onclick = function() {
						window.open(this.childNodes[1].src);
					};
				}
			}
		}
	}
}

function zoomTextarea(id, zoom) {
	zoomSize = zoom ? 10 : -10;
	obj = document.getElementById(id);
	if(obj.rows + zoomSize > 0 && obj.cols + zoomSize * 3 > 0) {
		obj.rows += zoomSize;
		obj.cols += zoomSize * 3;
	}
}

function ischeck(id, prefix) {
	form = document.getElementById(id);
	for(var i = 0; i < form.elements.length; i++) {
		var e = form.elements[i];
		if(e.name.match(prefix) && e.checked) {
			if(confirm("您确定要执行本操作吗？")) {
				return true;
			} else {
				return false;
			}
		}
	}
	alert('请选择要操作的对象');
	return false;
}

function copyRow(tbody) {
	var add = false;
	var newnode;
	if(document.getElementById(tbody).rows.length == 1 && document.getElementById(tbody).rows[0].style.display == 'none') {
		document.getElementById(tbody).rows[0].style.display = '';
		newnode = document.getElementById(tbody).rows[0];
	} else {
		newnode = document.getElementById(tbody).rows[0].cloneNode(true);
		add = true;
	}
	tags = newnode.getElementsByTagName('input');
	for(i in tags) {
		if(tags[i].name == 'pics[]') {
			tags[i].value = 'http://';
		}
	}
	if(add) {
		document.getElementById(tbody).appendChild(newnode);
	}
}

function delRow(obj, tbody) {
	if(document.getElementById(tbody).rows.length == 1) {
		var trobj = obj.parentNode.parentNode;
		tags = trobj.getElementsByTagName('input');
		for(i in tags) {
			if(tags[i].name == 'pics[]') {
				tags[i].value = 'http://';
			}
		}
		trobj.style.display='none';
	} else {
		document.getElementById(tbody).removeChild(obj.parentNode.parentNode);
	}
}

function insertWebImg(obj) {
	if(checkImage(obj.value)) {
		insertImage(obj.value);
		obj.value = 'http://';
	} else {
		alert('图片地址不正确');
	}
}

function checkFocus(target) {
	var obj = document.getElementById(target);
	if(!obj.hasfocus) {
		obj.focus();
	}
}
function insertImage(text) {
	text = "\n[img]" + text + "[/img]\n";
	insertContent('message', text);
}

function insertContent(target, text) {
	var obj = document.getElementById(target);
	selection = document.selection;
	checkFocus(target);
	if(!isUndefined(obj.selectionStart)) {
		var opn = obj.selectionStart + 0;
		obj.value = obj.value.substr(0, obj.selectionStart) + text + obj.value.substr(obj.selectionEnd);
	} else if(selection && selection.createRange) {
		var sel = selection.createRange();
		sel.text = text;
		sel.moveStart('character', -strlen(text));
	} else {
		obj.value += text;
	}
}

function checkImage(url) {
	var re = /^http\:\/\/.{5,200}\.(jpg|gif|png)$/i;
	return url.match(re);
}

function quick_validate(obj) {
	if(document.getElementById('seccode')) {
		var code = document.getElementById('seccode').value;
		var x = new Ajax();
		x.get('cp.php?ac=common&op=seccode&code=' + code, function(s){
			s = trim(s);
			if(s != 'succeed') {
				alert(s);
				document.getElementById('seccode').focus();
		   		return false;
			} else {
				obj.form.submit();
				return true;
			}
		});
	} else {
		obj.form.submit();
		return true;
	}
}

function stopMusic(preID, playerID) {
	var musicFlash = preID.toString() + '_' + playerID.toString();
	if(document.getElementById(musicFlash)) {
		document.getElementById(musicFlash).SetVariable('closePlayer', 1);
	}
}
function showFlash(host, flashvar, obj, shareid) {
	var flashAddr = {
		'youku.com' : 'http://player.youku.com/player.php/sid/FLASHVAR=/v.swf',
		'ku6.com' : 'http://player.ku6.com/refer/FLASHVAR/v.swf',
		'youtube.com' : 'http://www.youtube.com/v/FLASHVAR',
		'5show.com' : 'http://www.5show.com/swf/5show_player.swf?flv_id=FLASHVAR',
		'sina.com.cn' : 'http://vhead.blog.sina.com.cn/player/outer_player.swf?vid=FLASHVAR',
		'sohu.com' : 'http://v.blog.sohu.com/fo/v4/FLASHVAR',
		'mofile.com' : 'http://tv.mofile.com/cn/xplayer.swf?v=FLASHVAR',
		'music' : 'FLASHVAR',
		'flash' : 'FLASHVAR'
	};
	var flash = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0" width="480" height="400">'
	    + '<param name="movie" value="FLASHADDR" />'
	    + '<param name="quality" value="high" />'
	    + '<param name="bgcolor" value="#FFFFFF" />'
	    + '<embed width="480" height="400" menu="false" quality="high" src="FLASHADDR" type="application/x-shockwave-flash" />'
	    + '</object>';
	var videoFlash = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="480" height="450">'
		+ '<param value="transparent" name="wmode"/>'
		+ '<param value="FLASHADDR" name="movie" />'
		+ '<embed src="FLASHADDR" wmode="transparent" allowfullscreen="true" type="application/x-shockwave-flash" width="480" height="450"></embed>'
		+ '</object>';
	var musicFlash = '<object id="audioplayer_SHAREID" height="24" width="290" data="' + STATICURL + 'image/common/player.swf" type="application/x-shockwave-flash">'
		+ '<param value="' + STATICURL + 'image/common/player.swf" name="movie"/>'
		+ '<param value="autostart=yes&bg=0xCDDFF3&leftbg=0x357DCE&lefticon=0xF2F2F2&rightbg=0xF06A51&rightbghover=0xAF2910&righticon=0xF2F2F2&righticonhover=0xFFFFFF&text=0x357DCE&slider=0x357DCE&track=0xFFFFFF&border=0xFFFFFF&loader=0xAF2910&soundFile=FLASHADDR" name="FlashVars"/>'
		+ '<param value="high" name="quality"/>'
		+ '<param value="false" name="menu"/>'
		+ '<param value="#FFFFFF" name="bgcolor"/>'
	    + '</object>';
	var musicMedia = '<object height="64" width="290" data="FLASHADDR" type="audio/x-ms-wma">'
	    + '<param value="FLASHADDR" name="src"/>'
	    + '<param value="1" name="autostart"/>'
	    + '<param value="true" name="controller"/>'
	    + '</object>';
	var flashHtml = videoFlash;
	var videoMp3 = true;
	if('' == flashvar) {
		alert('音乐地址错误，不能为空');
		return false;
	}
	if('music' == host) {
		var mp3Reg = new RegExp('.mp3$', 'ig');
		var flashReg = new RegExp('.swf$', 'ig');
		flashHtml = musicMedia;
		videoMp3 = false;
		if(mp3Reg.test(flashvar)) {
			videoMp3 = true;
			flashHtml = musicFlash;
		} else if(flashReg.test(flashvar)) {
			videoMp3 = true;
			flashHtml = flash;
		}
	}
	flashvar = encodeURI(flashvar);
	if(flashAddr[host]) {
		var flash = flashAddr[host].replace('FLASHVAR', flashvar);
		flashHtml = flashHtml.replace(/FLASHADDR/g, flash);
		flashHtml = flashHtml.replace(/SHAREID/g, shareid);
	}

	if(!obj) {
		document.getElementById('flash_div_' + shareid).innerHTML = flashHtml;
		return true;
	}
	if(document.getElementById('flash_div_' + shareid)) {
		document.getElementById('flash_div_' + shareid).style.display = '';
		document.getElementById('flash_hide_' + shareid).style.display = '';
		obj.style.display = 'none';
		return true;
	}
	if(flashAddr[host]) {
		var flashObj = document.createElement('div');
		flashObj.id = 'flash_div_' + shareid;
		obj.parentNode.insertBefore(flashObj, obj);
		flashObj.innerHTML = flashHtml;
		obj.style.display = 'none';
		var hideObj = document.createElement('div');
		hideObj.id = 'flash_hide_' + shareid;
		var nodetxt = document.createTextNode("收起");
		hideObj.appendChild(nodetxt);
		obj.parentNode.insertBefore(hideObj, obj);
		hideObj.style.cursor = 'pointer';
		hideObj.onclick = function() {
			if(true == videoMp3) {
				stopMusic('audioplayer', shareid);
				flashObj.parentNode.removeChild(flashObj);
				hideObj.parentNode.removeChild(hideObj);
			} else {
				flashObj.style.display = 'none';
				hideObj.style.display = 'none';
			}
			obj.style.display = '';
		};
	}
}

function userapp_open() {
	var x = new Ajax();
	x.get('home.php?mod=spacecp&ac=common&op=getuserapp&inajax=1', function(s){
		document.getElementById('my_userapp').innerHTML = s;
		document.getElementById('a_app_more').className = 'fold';
		document.getElementById('a_app_more').innerHTML = '收起';
		document.getElementById('a_app_more').onclick = function() {
			userapp_close();
		};
	});
}

function userapp_close() {
	var x = new Ajax();
	x.get('home.php?mod=spacecp&ac=common&op=getuserapp&subop=off&inajax=1', function(s){
		document.getElementById('my_userapp').innerHTML = s;
		document.getElementById('a_app_more').className = 'unfold';
		document.getElementById('a_app_more').innerHTML = '展开';
		document.getElementById('a_app_more').onclick = function() {
			userapp_open();
		};
	});
}

function startMarquee(h, speed, delay, sid) {
	var t = null;
	var p = false;
	var o = document.getElementById(sid);
	o.innerHTML += o.innerHTML;
	o.onmouseover = function() {p = true};
	o.onmouseout = function() {p = false};
	o.scrollTop = 0;
	function start() {
	    t = setInterval(scrolling, speed);
	    if(!p) {
			o.scrollTop += 2;
		}
	}
	function scrolling() {
	    if(p) return;
		if(o.scrollTop % h != 0) {
	        o.scrollTop += 2;
	        if(o.scrollTop >= o.scrollHeight/2) o.scrollTop = 0;
	    } else {
	        clearInterval(t);
	        setTimeout(start, delay);
	    }
	}
	setTimeout(start, delay);
}

function readfeed(obj, id) {
	if(Cookie.get("read_feed_ids")) {
		var fcookie = Cookie.get("read_feed_ids");
		fcookie = id + ',' + fcookie;
	} else {
		var fcookie = id;
	}
	Cookie.set("read_feed_ids", fcookie, 48);
	obj.className = 'feedread';
}

function showreward() {
	if(Cookie.get('reward_notice_disable')) {
		return false;
	}
	var x = new Ajax();
	x.get('home.php?mod=misc&ac=ajax&op=getreward', function(s){
		if(s) {
			msgwin(s, 2000);
		}
	});
}

function msgwin(s, t) {

	var msgWinObj = document.getElementById('msgwin');
	if(!msgWinObj) {
		var msgWinObj = document.createElement("div");
		msgWinObj.id = 'msgwin';
		msgWinObj.style.display = 'none';
		msgWinObj.style.position = 'absolute';
		msgWinObj.style.zIndex = '100000';
		document.getElementById('append_parent').appendChild(msgWinObj);
	}
	msgWinObj.innerHTML = s;
	msgWinObj.style.display = '';
	msgWinObj.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=0)';
	msgWinObj.style.opacity = 0;
	var sTop = document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
	pbegin = sTop + (document.documentElement.clientHeight / 2);
	pend = sTop + (document.documentElement.clientHeight / 5);
	setTimeout(function () {showmsgwin(pbegin, pend, 0, t)}, 10);
	msgWinObj.style.left = ((document.documentElement.clientWidth - msgWinObj.clientWidth) / 2) + 'px';
	msgWinObj.style.top = pbegin + 'px';
}

function showmsgwin(b, e, a, t) {
	step = (b - e) / 10;
	var msgWinObj = document.getElementById('msgwin');
	newp = (parseInt(msgWinObj.style.top) - step);
	if(newp > e) {
		msgWinObj.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + a + ')';
		msgWinObj.style.opacity = a / 100;
		msgWinObj.style.top = newp + 'px';
		setTimeout(function () {showmsgwin(b, e, a += 10, t)}, 10);
	} else {
		msgWinObj.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=100)';
		msgWinObj.style.opacity = 1;
		setTimeout('displayOpacity(\'msgwin\', 100)', t);
	}
}

function displayOpacity(id, n) {
	if(!document.getElementById(id)) {
		return;
	}
	if(n >= 0) {
		n -= 10;
		document.getElementById(id).style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + n + ')';
		document.getElementById(id).style.opacity = n / 100;
		setTimeout('displayOpacity(\'' + id + '\',' + n + ')', 50);
	} else {
		document.getElementById(id).style.display = 'none';
		document.getElementById(id).style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=100)';
		document.getElementById(id).style.opacity = 1;
	}
}

function urlto(url) {
	window.location.href = url;
}

function explode(sep, string) {
	return string.split(sep);
}

function selector(pattern, context) {
	var re = new RegExp('([a-z0-9]*)([\.#:]*)(.*|$)', 'ig');
	var match = re.exec(pattern);
	var conditions = cc = [];
	if (match[2] == '#')	conditions.push(['id', '=', match[3]]);
	else if(match[2] == '.')	conditions.push(['className', '~=', match[3]]);
	else if(match[2] == ':')	conditions.push(['type', '=', match[3]]);
	var s = match[3].replace(/\[(.*)\]/g,'$1').split('@');
	for(var i=0; i<s.length; i++) {
		if (cc = /([\w]+)([=^%!$~]+)(.*)$/.exec(s[i]))
			conditions.push([cc[1], cc[2], cc[3]]);
	}
	var list = conditions[0] && conditions[0][0] == 'id' ? [document.getElementById(conditions[0][2])] : (context || document).getElementsByTagName(match[1] || "*");
	if(!list || !list.length)	return [];
	if(conditions) {
		var elements = [];
		var attrMapping = {'for': 'htmlFor', 'class': 'className'};
		for(var i=0; i<list.length; i++) {
			var pass = true;
			for(var j=0; j<conditions.length; j++) {
				var attr = attrMapping[conditions[j][0]] || conditions[j][0];
				var val = list[i][attr] || (list[i].getAttribute ? list[i].getAttribute(attr) : '');
				var pattern = null;
				if(conditions[j][1] == '=') {
					pattern = new RegExp('^'+conditions[j][2]+'$', 'i');
				} else if(conditions[j][1] == '^=') {
					pattern = new RegExp('^' + conditions[j][2], 'i');
				} else if(conditions[j][1] == '$=') {
					pattern = new RegExp(conditions[j][2] + '$', 'i');
				} else if(conditions[j][1] == '%=') {
					pattern = new RegExp(conditions[j][2], 'i');
				} else if(conditions[j][1] == '~=') {
					pattern = new RegExp('(^|[ ])' + conditions[j][2] + '([ ]|$)', 'i');
				}
				if(pattern && !pattern.test(val)) {
					pass = false;
					break;
				}
			}
			if(pass) elements.push(list[i]);
		}
		return elements;
	} else {
		return list;
	}
}

function showBlock(cid, oid) {
	if(parseInt(cid)) {
		var listObj = document.getElementById(oid);
		var x = new Ajax();
		x.get('portal.php?mod=cp&ac=block&operation=getblock&classid='+cid, function(s){
			listObj.innerHTML = s;
		})
	}
}

function resizeTx(obj){
	var oid = obj.id + '_limit';
	if(!BROWSER.ie) obj.style.height = 0;
	obj.style.height = obj.scrollHeight + 'px';
	if(document.getElementById(oid)) document.getElementById(oid).style.display = obj.scrollHeight > 30 ? '':'none';
}

function showFace(showid, target, dropstr) {
	if(document.getElementById(showid + '_menu') != null) {
		document.getElementById(showid+'_menu').style.display = '';
	} else {
		var faceDiv = document.createElement("div");
		faceDiv.id = showid+'_menu';
		faceDiv.className = 'p_pop facel';
		faceDiv.style.position = 'absolute';
		faceDiv.style.zIndex = 1001;
		var faceul = document.createElement("ul");
		for(i=1; i<31; i++) {
			var faceli = document.createElement("li");
			faceli.innerHTML = '<img src="' + STATICURL + 'image/smiley/comcom/'+i+'.gif" onclick="insertFace(\''+showid+'\','+i+', \''+ target +'\', \''+dropstr+'\')" style="cursor:pointer; position:relative;" />';
			faceul.appendChild(faceli);
		}
		faceDiv.appendChild(faceul);
		document.getElementById('append_parent').appendChild(faceDiv)
	}
	setMenuPosition(showid, 0);
	doane();
	_attachEvent(document.body, 'click', function(){if(document.getElementById(showid+'_menu')) document.getElementById(showid+'_menu').style.display = 'none';});
}

function insertFace(showid, id, target, dropstr) {
	var faceText = '[em:'+id+':]';
	if(document.getElementById(target) != null) {
		insertContent(target, faceText);
		if(dropstr) {
			document.getElementById(target).value = document.getElementById(target).value.replace(dropstr, "");
		}
	}
}

function wall_add(id) {
	var obj = document.getElementById('comment_ul');
	var newdl = document.createElement("dl");
	newdl.id = 'comment_'+id+'_li';
	newdl.className = 'bbda cl';
	var x = new Ajax();
	x.get('home.php?mod=misc&ac=ajax&op=comment&inajax=1&cid='+id, function(s){
		newdl.innerHTML = s;
	});
	obj.insertBefore(newdl, obj.firstChild);
	if(document.getElementById('comment_message')) {
		document.getElementById('comment_message').value= '';
	}
	showCreditPrompt();
}

function share_add(sid) {
	var obj = document.getElementById('share_ul');
	var newli = document.createElement("li");
	var x = new Ajax();
	x.get('home.php?mod=misc&ac=ajax&op=share&inajax=1&sid='+sid, function(s){
		newli.innerHTML = s;
	});
	obj.insertBefore(newli, obj.firstChild);
	document.getElementById('share_link').value = 'http://';
	document.getElementById('share_general').value = '';
	showCreditPrompt();
}

function comment_add(id) {
	var obj = document.getElementById('comment_ul');
	var newdl = document.createElement("dl");
	newdl.id = 'comment_'+id+'_li';
	newdl.className = 'bbda cl';
	var x = new Ajax();
	x.get('home.php?mod=misc&ac=ajax&op=comment&inajax=1&cid='+id, function(s){
		newdl.innerHTML = s;
	});
	if(document.getElementById('comment_prepend')){
		obj = obj.firstChild;
		while (obj && obj.nodeType != 1){
			obj = obj.nextSibling;
		}
		obj.parentNode.insertBefore(newdl, obj);
	} else {
		obj.appendChild(newdl);
	}
	if(document.getElementById('comment_message')) {
		document.getElementById('comment_message').value= '';
	}
	if(document.getElementById('comment_replynum')) {
		var a = parseInt(document.getElementById('comment_replynum').innerHTML);
		var b = a + 1;
		document.getElementById('comment_replynum').innerHTML = b + '';
	}
	showCreditPrompt();
}
function comment_edit(cid) {
	var obj = document.getElementById('comment_'+ cid +'_li');
	var x = new Ajax();
	x.get('home.php?mod=misc&ac=ajax&op=comment&inajax=1&cid='+ cid, function(s){
		obj.innerHTML = s;
	});
}
function comment_delete(cid) {
	var obj = document.getElementById('comment_'+ cid +'_li');
	obj.style.display = "none";
	if(document.getElementById('comment_replynum')) {
		var a = parseInt(document.getElementById('comment_replynum').innerHTML);
		var b = a - 1;
		document.getElementById('comment_replynum').innerHTML = b + '';
	}
}

function share_delete(sid) {
	var obj = document.getElementById('share_'+ sid +'_li');
	obj.style.display = "none";
}
function friend_delete(uid) {
	var obj = document.getElementById('friend_'+ uid +'_li');
	if(obj != null) obj.style.display = "none";
	var obj2 = document.getElementById('friend_tbody_'+uid);
	if(obj2 != null) obj2.style.display = "none";
}
function friend_changegroup(id, result) {
	if(result) {
		var ids = explode('_', id);
		var uid = ids[1];
		var obj = document.getElementById('friend_group_'+ uid);
		var x = new Ajax();
		x.get('home.php?mod=misc&ac=ajax&op=getfriendgroup&uid='+uid, function(s){
			obj.innerHTML = s;
		});
	}
}
function friend_changegroupname(group) {
	var obj = document.getElementById('friend_groupname_'+ group);
	var x = new Ajax();
	x.get('home.php?mod=misc&ac=ajax&op=getfriendname&inajax=1&group='+group, function(s){
		obj.innerHTML = s;
	});
}
function post_add(pid, result) {
	if(result) {
		var obj = document.getElementById('post_ul');
		var newli = document.createElement("div");
		var x = new Ajax();
		x.get('home.php?mod=misc&ac=ajax&op=post', function(s){
			newli.innerHTML = s;
		});
		obj.appendChild(newli);
		if(document.getElementById('message')) {
			document.getElementById('message').value= '';
			newnode = document.getElementById('quickpostimg').rows[0].cloneNode(true);
			tags = newnode.getElementsByTagName('input');
			for(i in tags) {
				if(tags[i].name == 'pics[]') {
					tags[i].value = 'http://';
				}
			}
			var allRows = document.getElementById('quickpostimg').rows;
			while(allRows.length) {
				document.getElementById('quickpostimg').removeChild(allRows[0]);
			}
			document.getElementById('quickpostimg').appendChild(newnode);
		}
		if(document.getElementById('post_replynum')) {
			var a = parseInt(document.getElementById('post_replynum').innerHTML);
			var b = a + 1;
			document.getElementById('post_replynum').innerHTML = b + '';
		}
		showCreditPrompt();
	}
}
function post_edit(id, result) {
	if(result) {
		var ids = explode('_', id);
		var pid = ids[1];

		var obj = document.getElementById('post_'+ pid +'_li');
		var x = new Ajax();
		x.get('home.php?mod=misc&ac=ajax&op=post&pid='+ pid, function(s){
			obj.innerHTML = s;
		});
	}
}
function post_delete(id, result) {
	if(result) {
		var ids = explode('_', id);
		var pid = ids[1];

		var obj = document.getElementById('post_'+ pid +'_li');
		obj.style.display = "none";
		if(document.getElementById('post_replynum')) {
			var a = parseInt(document.getElementById('post_replynum').innerHTML);
			var b = a - 1;
			document.getElementById('post_replynum').innerHTML = b + '';
		}
	}
}
function poke_send(id, result) {
	if(result) {
		var ids = explode('_', id);
		var uid = ids[1];

		if(document.getElementById('poke_'+ uid)) {
			document.getElementById('poke_'+ uid).style.display = "none";
		}
		showCreditPrompt();
	}
}
function myfriend_post(uid) {
	if(document.getElementById('friend_'+uid)) {
		document.getElementById('friend_'+uid).innerHTML = '<p>你们现在是好友了，接下来，您还可以：<a href="home.php?mod=space&do=wall&uid='+uid+'" class="xi2" target="_blank">给TA留言</a> ，或者 <a href="home.php?mod=spacecp&ac=poke&op=send&uid='+uid+'&handlekey=propokehk_'+uid+'" id="a_poke_'+uid+'" class="xi2" onclick="showWindow(this.id, this.href, \'get\', 0, {\'ctrlid\':this.id,\'pos\':\'13\'});">打个招呼</a></p>';
	}
	showCreditPrompt();
}
function myfriend_ignore(id) {
	var ids = explode('_', id);
	var uid = ids[1];
	document.getElementById('friend_tbody_'+uid).style.display = "none";
}

function mtag_join(tagid, result) {
	if(result) {
		location.reload();
	}
}

function picView(albumid) {
	if(albumid == 'none') {
		document.getElementById('albumpic_body').innerHTML = '';
	} else {
		ajaxget('home.php?mod=misc&ac=ajax&op=album&id='+albumid+'&ajaxdiv=albumpic_body', 'albumpic_body');
	}
}
function resend_mail(mid) {
	if(mid) {
		var obj = document.getElementById('sendmail_'+ mid +'_li');
		obj.style.display = "none";
	}
}

function userapp_delete(id, result) {
	if(result) {
		var ids = explode('_', id);
		var appid = ids[1];
		document.getElementById('space_app_'+appid).style.display = "none";
	}
}

function docomment_get(doid, key) {
	var showid = key + '_' + doid;
	var opid = key + '_do_a_op_'+doid;
	document.getElementById(showid).style.display = '';
	document.getElementById(showid).className = 'cmt brm';
	ajaxget('home.php?mod=spacecp&ac=doing&op=getcomment&handlekey=msg_'+doid+'&doid='+doid+'&key='+key, showid);
	if(document.getElementById(opid)) {
		document.getElementById(opid).innerHTML = '收起';
		document.getElementById(opid).onclick = function() {
			docomment_colse(doid, key);
		}
	}
	showCreditPrompt();
}

function docomment_colse(doid, key) {
	var showid = key + '_' + doid;
	var opid = key + '_do_a_op_'+doid;

	document.getElementById(showid).style.display = 'none';
	document.getElementById(showid).style.className = '';

	document.getElementById(opid).innerHTML = '回复';
	document.getElementById(opid).onclick = function() {
		docomment_get(doid, key);
	}
}

function docomment_form(doid, id, key) {
	var showid = key + '_form_'+doid+'_'+id;
	var divid = key +'_'+ doid;
	var url = 'home.php?mod=spacecp&ac=doing&op=docomment&handlekey=msg_'+id+'&doid='+doid+'&id='+id+'&key='+key;
	if(parseInt(discuz_uid)) {
		ajaxget(url, showid);
		if(document.getElementById(divid)) {
			document.getElementById(divid).style.display = '';
		}
	} else {
		showWindow(divid, url);
	}
}

function docomment_form_close(doid, id, key) {
	var showid = key + '_form_' + doid + '_' + id;
	var opid = key + '_do_a_op_' + doid;
	document.getElementById(showid).innerHTML = '';
	document.getElementById(showid).style.display = 'none';
	var liObj = document.getElementById(key+'_'+doid).getElementsByTagName('li');
	if(!liObj.length) {
		document.getElementById(key+'_'+doid).style.display = 'none';
		if(document.getElementById(opid)) {
			document.getElementById(opid).innerHTML = '回复';
			document.getElementById(opid).onclick = function () {
				docomment_get(doid, key);
			}
		}
	}
}

function feedcomment_get(feedid) {
	var showid = 'feedcomment_'+feedid;
	var opid = 'feedcomment_a_op_'+feedid;

	document.getElementById(showid).style.display = '';
	ajaxget('home.php?mod=spacecp&ac=feed&op=getcomment&feedid='+feedid+'&handlekey=feedhk_'+feedid, showid);
	if(document.getElementById(opid) != null) {
		document.getElementById(opid).innerHTML = '收起';
		document.getElementById(opid).onclick = function() {
			feedcomment_close(feedid);
		}
	}
}

function feedcomment_add(cid, feedid) {
	var obj = document.getElementById('comment_ol_'+feedid);
	var newdl = document.createElement("dl");
	newdl.id = 'comment_'+cid+'_li';
	newdl.className = 'bbda cl';
	var x = new Ajax();
	x.get('home.php?mod=misc&ac=ajax&op=comment&inajax=1&cid='+cid, function(s){
		newdl.innerHTML = s;
	});
	obj.appendChild(newdl);

	document.getElementById('feedmessage_'+feedid).value= '';
	showCreditPrompt();
}

function feedcomment_close(feedid) {
	var showid = 'feedcomment_'+feedid;
	var opid = 'feedcomment_a_op_'+feedid;

	document.getElementById(showid).style.display = 'none';
	document.getElementById(showid).style.className = '';

	document.getElementById(opid).innerHTML = '评论';
	document.getElementById(opid).onclick = function() {
		feedcomment_get(feedid);
	}
}

function feed_post_result(feedid, result) {
	if(result) {
		location.reload();
	}
}

function feed_more_show(feedid) {
	var showid = 'feed_more_'+feedid;
	var opid = 'feed_a_more_'+feedid;

	document.getElementById(showid).style.display = '';
	document.getElementById(showid).className = 'sub_doing';

	document.getElementById(opid).innerHTML = '&laquo; 收起列表';
	document.getElementById(opid).onclick = function() {
		feed_more_close(feedid);
	}
}

function feed_more_close(feedid) {
	var showid = 'feed_more_'+feedid;
	var opid = 'feed_a_more_'+feedid;

	document.getElementById(showid).style.display = 'none';

	document.getElementById(opid).innerHTML = '&raquo; 更多动态';
	document.getElementById(opid).onclick = function() {
		feed_more_show(feedid);
	}
}

function poll_post_result(id, result) {
	if(result) {
		var aObj = document.getElementById('__'+id).getElementsByTagName("a");
		window.location.href = aObj[0].href;
	}
}

function show_click(idtype, id, clickid) {
	ajaxget('home.php?mod=spacecp&ac=click&op=show&clickid='+clickid+'&idtype='+idtype+'&id='+id, 'click_div');
	showCreditPrompt();
}

function feed_menu(feedid, show) {
	var obj = document.getElementById('a_feed_menu_'+feedid);
	if(obj) {
		if(show) {
			obj.style.display='block';
		} else {
			obj.style.display='none';
		}
	}
	var obj = document.getElementById('feedmagic_'+feedid);
	if(obj) {
		if(show) {
			obj.style.display='block';
		} else {
			obj.style.display='none';
		}
	}
}

function showbirthday(){
	var el = document.getElementById('birthday');
	var birthday = el.value;
	el.length=0;
	el.options.add(new Option('日', ''));
	for(var i=0;i<28;i++){
		el.options.add(new Option(i+1, i+1));
	}
	if(document.getElementById('birthmonth').value!="2"){
		el.options.add(new Option(29, 29));
		el.options.add(new Option(30, 30));
		switch(document.getElementById('birthmonth').value){
			case "1":
			case "3":
			case "5":
			case "7":
			case "8":
			case "10":
			case "12":{
				el.options.add(new Option(31, 31));
			}
		}
	} else if(document.getElementById('birthyear').value!="") {
		var nbirthyear=document.getElementById('birthyear').value;
		if(nbirthyear%400==0 || (nbirthyear%4==0 && nbirthyear%100!=0)) el.options.add(new Option(29, 29));
	}
	el.value = birthday;
}

function magicColor(elem, t) {
	t = t || 10;
	elem = (elem && elem.constructor == String) ? document.getElementById(elem) : elem;
	if(!elem){
		setTimeout(function(){magicColor(elem, t-1);}, 400);
		return;
	}
	if(window.mcHandler == undefined) {
		window.mcHandler = {elements:[]};
		window.mcHandler.colorIndex = 0;
		window.mcHandler.run = function(){
			var color = ["#CC0000","#CC6D00","#CCCC00","#00CC00","#0000CC","#00CCCC","#CC00CC"][(window.mcHandler.colorIndex++) % 7];
			for(var i = 0, L=window.mcHandler.elements.length; i<L; i++)
				window.mcHandler.elements[i].style.color = color;
		}
	}
	window.mcHandler.elements.push(elem);
	if(window.mcHandler.timer == undefined) {
		window.mcHandler.timer = setInterval(window.mcHandler.run, 500);
	}
}

function passwordShow(value) {
	if(value==4) {
		document.getElementById('span_password').style.display = '';
		document.getElementById('tb_selectgroup').style.display = 'none';
	} else if(value==2) {
		document.getElementById('span_password').style.display = 'none';
		document.getElementById('tb_selectgroup').style.display = '';
	} else {
		document.getElementById('span_password').style.display = 'none';
		document.getElementById('tb_selectgroup').style.display = 'none';
	}
}

function getgroup(gid) {
	if(gid) {
		var x = new Ajax();
		x.get('home.php?mod=spacecp&ac=privacy&inajax=1&op=getgroup&gid='+gid, function(s){
			s = s + ' ';
			document.getElementById('target_names').innerHTML += s;
		});
	}
}

function pmsendappend() {
	document.getElementById('pm_append').style.display = '';
	document.getElementById('pm_append').id = '';
	div = document.createElement('div');
	div.id = 'pm_append';
	div.style.display = 'none';
	document.getElementById('pm_ul').appendChild(div);
	document.getElementById('replymessage').value = '';
	showCreditPrompt();
}

function succeedhandle_pmsend(locationhref, message, param) {
	ajaxget('home.php?mod=spacecp&ac=pm&op=viewpmid&pmid=' + param['pmid'], 'pm_append', 'ajaxwaitid', '', null, 'pmsendappend()');
}

function changeOrderRange(id) {
	if(!document.getElementById(id)) return false;
	var url = window.location.href;
	var a = document.getElementById(id).getElementsByTagName('a');
	for(var i = 0; i < a.length; i++) {
		a[i].onclick = function () {
			if(url.indexOf("&orderby=") == -1) {
				url += "&orderby=" + this.id;
			} else {
				url = url.replace(/orderby=.*/, "orderby=" + this.id);
			}
			window.location = url;
			return false;
		}
	}
}