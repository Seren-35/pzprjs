//
// パズル固有スクリプト部 快刀乱麻・新・快刀乱麻・ヤギとオオカミ版 kramma.js v3.4.1
//
pzpr.classmgr.makeCustom(['kramma','kramman','shwolf'], {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	mouseinput : function(){
		if(this.puzzle.playmode){
			if(this.mousestart || this.mousemove){
				if(this.btn.Left && this.isBorderMode()){ this.inputborder();}
				else{ this.inputQsubLine();}
			}
		}
		else if(this.puzzle.editmode){
			if(this.mousestart && this.pid!=='kramma'){ this.inputcrossMark();}
			else if(this.mouseend && this.notInputted()){ this.inputqnum();}
		}
	},

	// オーバーライド
	inputborder : function(){
		var pos = this.getpos(0.35);
		if(this.prevPos.equals(pos)){ return;}

		var border = this.prevPos.getborderobj(pos);
		if(!border.isnull){
			if(this.inputData===null){ this.inputData=(border.isBorder()?0:1);}

			var d = border.getlinesize();
			var borders = this.board.borderinside(d.x1,d.y1,d.x2,d.y2);
			for(var i=0;i<borders.length;i++){
				if     (this.inputData===1){ borders[i].setBorder();}
				else if(this.inputData===0){ borders[i].removeBorder();}
			}

			this.puzzle.painter.paintRange(d.x1-1,d.y1-1,d.x2+1,d.y2+1);
		}
		this.prevPos = pos;
	}
},

//---------------------------------------------------------
// キーボード入力系
KeyEvent:{
	enablemake : true
},

//---------------------------------------------------------
// 盤面管理系
Cell:{
	numberAsObject : true,

	maxnum : 2
},
Cross:{
	noNum : function(){ return this.id!==null && this.qnum===-1;}
},

Border:{
	getlinesize : function(){
		var pos1 = this.getaddr(), pos2 = pos1.clone();
		if(this.isVert()){
			while(pos1.move(0,-1).getx().noNum()){ pos1.move(0,-1);}
			while(pos2.move(0, 1).getx().noNum()){ pos2.move(0, 1);}
		}
		else{
			while(pos1.move(-1,0).getx().noNum()){ pos1.move(-1,0);}
			while(pos2.move( 1,0).getx().noNum()){ pos2.move( 1,0);}
		}
		return {x1:pos1.bx, y1:pos1.by, x2:pos2.bx, y2:pos2.by};
	}
},

Board:{
	hascross  : 1,
	hasborder : 1
},
"Board@kramma,krammar":{
	cols : 8,
	rows : 8
},

AreaRoomGraph:{
	enabled : true
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	gridcolor_type : "DLIGHT",

	bordercolor_func : "qans",
	borderQanscolor : "rgb(64, 64, 255)",

	circlefillcolor_func   : "qnum2",
	circlestrokecolor_func : "qnum2",

	crosssize : 0.15,

	paint : function(){
		this.drawBGCells();
		this.drawDashedGrid();
		this.drawBorders();

		if(this.pid!=='shwolf'){ this.drawCircles();}
		else                   { this.drawSheepWolf();}

		if(this.pid!=='kramma'){ this.drawCrossMarks();}

		this.drawHatenas();

		this.drawBorderQsubs();

		this.drawChassis();

		this.drawTarget();
	}
},
"Graphic@shwolf":{
	initialize : function(){
		this.common.initialize.call(this);

		/* imgtileの初期設定を追加 */
		var imgsrc = (!pzpr.env.browser.legacyIE ? this.imgsrc_dataurl : this.imgsrc_imgfile);
		this.imgtile = new this.klass.ImageTile(imgsrc, 2, 1);
	},
	imgsrc_dataurl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABABAMAAAAg+GJMAAAAMFBMVEUAAACtAADv97X/a/f//wD///////////////////////////////////////////81EdaHAAAAEHRSTlP///8A////////////////8M8+MgAAAk5JREFUeJzF10FywyAMBdDvuNmTG2RyAmZ8gS56AG96/6sUAYIPCDduOymbJLb1ImSCFWy/HPgzAC2F9STgW8A/BXg0AIeAPGAyz/ilBbi0AH0E7HQ8GMDlDj73IOBmCwgnChAiGuDyuBPgrEkASws86CJcyMMtCEMKPsQTECKOAGMSiIc7QMoiYwv5PBpgmERMgAGJoNEDveBjAg0Q466fMsKbSw90ZfDpIAF3jZaxSw4VWNLF0BlCj7kCyKlPHqDllwHHU9SsFOjjYw5NvWMKi77RpNYMeM6/Eu18aTglFRjDG0G/eXS2BHgY8SKssxRqAgJ4M4FYya4KXXzKXk7b8UFYFTAEp8A0gQqYKeT8MKtAqkK7GscKCDBPgFMwgHzmYAY1Bes+VGAeH1J4AigJIC3oHbSwFTCW0gCAgetJYIcAlPk1HTsE1grA+DHFfPYDwCmAazPrUn9RnwG2uHcM92IHP5IOgfRUHID4S2sA1J0FDORiWkAZEXAfH2knTK8OJwDkwHd5ffspECLfQ6R7S87tPOB0M19+CJhL8e+Abini5YDvge3lAL4HXP5FOOs2vh4AWqBbCHsHxMXHAM4CQhBQW6YZ0HV10sIsBFD7Ud4099FqLEuH4hZqGxnIW2vYDrsaFiED3HaWKz0DuwFob9j1jBXgIpiAPORdLCafpf8VhyVIl8S7p9vpAHCjeQjgCcCMD+2ay/8SLKA2CrME5Ckf62ADmz4hp3+ycpvQ7TX8vjbTk2Gc5k/+u/h0RTu/g6snQlefk8A4/h/4AjUhvQ8aixc0AAAAAElFTkSuQmCC",
	imgsrc_imgfile : pzpr.util.getpath()+'../img/shwolf_obj.png',

	initCanvasCheck : function(){
		/* imgtileの条件判定を追加 */
		return this.common.initCanvasCheck.call(this) && this.imgtile.loaded;
	},

	drawSheepWolf : function(){
		var g = this.vinc('cell_number_image', 'auto');

		var clist = this.range.cells;
		for(var i=0;i<clist.length;i++){
			var cell = clist[i], keyimg = ['cell',cell.id,'quesimg'].join('_');
			var rx = (cell.bx-1)*this.bw, ry = (cell.by-1)*this.bh;
			
			this.imgtile.putImage(g, keyimg, (cell.qnum>0?cell.qnum-1:null), rx,ry,this.cw,this.ch);
		}
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	decodePzpr : function(type){
		if(this.pid==='shwolf' || !this.checkpflag("c")){
			this.decodeCrossMark();
			this.decodeCircle();
		}
		else{
			this.decodeCircle();
		}

		if(this.pid==='kramma'){ this.checkPuzzleid();}
	},
	encodePzpr : function(type){
		if(this.pid!=='kramma'){
			this.encodeCrossMark();
			this.encodeCircle();
		}
		else{
			this.outpflag="c";
			this.encodeCircle();
		}
	},

	checkPuzzleid : function(){
		var puzzle=this.puzzle, bd=puzzle.board;
		for(var c=0;c<bd.crossmax;c++){
			if(bd.cross[c].qnum===1){ puzzle.changepid('kramman'); break;}
		}
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		this.decodeCellQnum();
		this.decodeCrossNum();
		this.decodeBorderAns();

		if(this.pid==='kramma'){ this.puzzle.enc.checkPuzzleid();}
	},
	encodeData : function(){
		this.encodeCellQnum();
		this.encodeCrossNum();
		this.encodeBorderAns();
	}
},

//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checklist : [
		"checkBorderBranch@!kramma",
		"checkBorderCrossOnBP@!kramma",
		"checkLcntCurve@!kramma",
		"checkLineChassis@shwolf",

		"checkNoNumber",
		"checkSameObjectInArea",

		"checkBorderDeadend+@!kramma",
		"checkBorderNoneOnBP@kramman"
	],

	checkBorderBranch    : function(){ this.checkBorderCount(3,0, "bdBranch");},
	checkBorderCrossOnBP : function(){ this.checkBorderCount(4,1, "bdCrossBP");},
	checkBorderNoneOnBP  : function(){ this.checkBorderCount(0,1, "bdIgnoreBP");},

	checkSameObjectInArea : function(){
		this.checkSameObjectInRoom(this.board.roommgr, function(cell){ return cell.getNum();}, "bkPlNum");
	},

	checkLcntCurve : function(){
		var bd = this.board;
		var crosses = bd.crossinside(bd.minbx+2,bd.minby+2,bd.maxbx-2,bd.maxby-2);
		for(var c=0;c<crosses.length;c++){
			var cross = crosses[c], adb = cross.adjborder;
			if(cross.lcnt!==2 || cross.qnum===1){ continue;}
			if( (adb.top.qans===1 && adb.bottom.qans===1) ||
				(adb.left.qans===1 && adb.right.qans===1) ){ continue;}
			
			this.failcode.add("bdCurveExBP");
			if(this.checkOnly){ break;}
			cross.setCrossBorderError();
		}
	},

	// ヤギとオオカミ用
	checkLineChassis : function(){
		var result = true, bd = this.board;
		var lines = [];
		for(var id=0;id<bd.bdmax;id++){ lines[id]=bd.border[id].qans;}

		var pos = new this.klass.Address(0,0);
		for(pos.bx=bd.minbx;pos.bx<=bd.maxbx;pos.bx+=2){
			for(pos.by=bd.minby;pos.by<=bd.maxby;pos.by+=2){
				/* 盤面端から探索をスタートする */
				if((pos.bx===bd.minbx||pos.bx===bd.maxbx)!==(pos.by===bd.minby||pos.by===bd.maxby)){
					if     (pos.by===bd.minby){ this.clearLineInfo(lines,pos,2);}
					else if(pos.by===bd.maxby){ this.clearLineInfo(lines,pos,1);}
					else if(pos.bx===bd.minbx){ this.clearLineInfo(lines,pos,4);}
					else if(pos.bx===bd.maxbx){ this.clearLineInfo(lines,pos,3);}
				}
			}
		}

		for(var id=0;id<bd.bdmax;id++){
			if(lines[id]!==1){ continue;}

			result = false;
			if(this.checkOnly){ break;}
			bd.border.filter(function(border){ return lines[border.id]===1;}).seterr(1);
		}

		if(!result){ 
			this.failcode.add("bdNotChassis");
			bd.border.setnoerr();
		}
	},
	clearLineInfo : function(lines,pos,dir){
		var stack = [[pos.clone(),dir]];
		while(stack.length>0){
			var dat = stack.pop();
			pos = dat[0];
			dir = dat[1];
			while(1){
				pos.movedir(dir,1);
				if(pos.oncross()){
					var cross = pos.getx(), adb = cross.adjborder;
					if(!cross.isnull && cross.qnum===1){
						if(adb.top.qans   ){ stack.push([pos.clone(),1]);}
						if(adb.bottom.qans){ stack.push([pos.clone(),2]);}
						if(adb.left.qans  ){ stack.push([pos.clone(),3]);}
						if(adb.right.qans ){ stack.push([pos.clone(),4]);}
						break;
					}
				}
				else{
					var border = pos.getb();
					if(border.isnull || lines[border.id]===0){ break;}
					lines[border.id]=0;
				}
			}
		}
	}
},

FailCode:{
	bkNoNum     : ["白丸も黒丸も含まれない領域があります。","An area has no marks."],
	bkPlNum     : ["白丸と黒丸が両方含まれる領域があります。","An area has both white and black circles."],
	bdBranch    : ["分岐している線があります。","There is a branch line."],
	bdCurveExBP : ["黒点以外のところで線が曲がっています。","A line curves out of the points."],
	bdCrossBP   : ["黒点上で線が交差しています。","There is a crossing line on the point."],
	bdIgnoreBP  : ["黒点上を線が通過していません。","A point has no line."]
},
"FailCode@shwolf":{
	bkNoNum : ["ヤギもオオカミもいない領域があります。","An area has neither sheeps nor wolves."],
	bkPlNum : ["ヤギとオオカミが両方いる領域があります。","An area has both sheeps and wolves."],
	bdNotChassis : ["外枠につながっていない線があります。","A line doesn't connect to the chassis."]
},

"ImageTile@shwolf":{
	initialize : function(src,col,row){
		this.image = new Image();
		this.image.src = src;

		this.cols = col;
		this.rows = row;

		this.waitload();
	},
	
	/* initialize()で設定する変数 */
	image : null,
	
	cols : 0,
	rows : 0,
	
	/* waitload()で設定する変数 */
	cwidth  : 0,
	cheight : 0,
	loaded : false,
	
	waitload : function(){
		if(!this.image.height){
			var self = this;
			setTimeout(function(){ self.waitload();},10);
			return;
		}
		this.cwidth  = this.image.width /this.cols;
		this.cheight = this.image.height/this.rows;
		this.loaded = true;
	},

	putImage : function(ctx,key,n,dx,dy,dw,dh){
		var sw=this.cwidth, sh=this.cheight;
		var sx=sw*(n%this.cols), sy=sh*((n/this.cols)|0);
		if(dw===(void 0)){ dw=sw; dh=sh;}
		
		ctx.vid = key;
		ctx.drawImage((n!==null?this.image:null), sx,sy,sw,sh, dx,dy,dw,dh);
	}
}
});
