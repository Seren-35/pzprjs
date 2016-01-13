//
// パズル固有スクリプト部 四角に切れ・アホになり切れ版 shikaku.js
//
(function(pidlist, classbase){
	if(typeof pzpr!=='undefined'){ pzpr.classmgr.makeCustom(pidlist, classbase);}
	else{ module.exports = [pidlist, classbase];}
})
(['shikaku','aho'], {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	mouseinput : function(){
		if(this.puzzle.playmode){
			if(this.mousestart || this.mousemove){
				if(this.btn==='left' && this.isBorderMode()){ this.inputborder();}
				else{ this.inputQsubLine();}
			}
		}
		else if(this.puzzle.editmode){
			if(this.mousestart){ this.inputqnum();}
		}
	}
},

//---------------------------------------------------------
// キーボード入力系
KeyEvent:{
	enablemake : true
},

//---------------------------------------------------------
// 盤面管理系
Board:{
	hasborder : 1
},

AreaRoomGraph:{
	enabled : true
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	hideHatena : true,

	gridcolor_type : "DLIGHT",

	bordercolor_func : "qans",

	fontcolor    : "white",
	fontErrcolor : "white",

	globalfontsizeratio : 0.85,
	circleratio : [0.40, 0.40],

	paint : function(){
		this.drawBGCells();
		this.drawDashedGrid();
		this.drawBorders();

		this.drawCircles();
		this.drawNumbers();
		this.drawBorderQsubs();

		this.drawChassis();

		this.drawTarget();
	},

	/* 黒丸を描画する */
	circlestrokecolor_func : "null",
	getCircleFillColor : function(cell){
		if(cell.qnum!==-1){
			return (cell.error===1 ? this.errcolor1 : this.quescolor);
		}
		return null;
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	decodePzpr : function(type){
		this.decodeNumber16();
	},
	encodePzpr : function(type){
		this.encodeNumber16();
	},

	decodeKanpen : function(){
		this.puzzle.fio.decodeCellQnum_kanpen();
	},
	encodeKanpen : function(){
		this.puzzle.fio.encodeCellQnum_kanpen();
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		this.decodeCellQnum();
		this.decodeBorderAns();
	},
	encodeData : function(){
		this.encodeCellQnum();
		this.encodeBorderAns();
	},

	kanpenOpen : function(){
		this.decodeCellQnum_kanpen();
		this.decodeAnsSquareRoom();
	},
	kanpenSave : function(){
		this.encodeCellQnum_kanpen();
		this.encodeAnsSquareRoom();
	},

	decodeAnsSquareRoom : function(){
		var barray = this.readLines(+this.readLine());
		var bd = this.board, rdata = [];
		for(var i=0;i<barray.length;i++){
			if(barray[i]===""){ break;}
			var pce = barray[i].split(" ");
			for(var n=0;n<4;n++){ if(!isNaN(pce[n])){ pce[n]=2*(+pce[n])+1;} }
			for(var bx=pce[1];bx<=pce[3];bx+=2){ for(var by=pce[0];by<=pce[2];by+=2){
				rdata[bd.getc(bx,by).id] = i;
			}}
		}
		this.rdata2Border(false, rdata);
		bd.roommgr.rebuild();
	},
	encodeAnsSquareRoom : function(){
		var bd = this.board;
		bd.roommgr.rebuild();
		var rooms = bd.roommgr.components;
		this.datastr += (rooms.length+"\n");
		for(var id=0;id<rooms.length;id++){
			var d = rooms[id].clist.getRectSize();
			this.datastr += (""+(d.y1>>1)+" "+(d.x1>>1)+" "+(d.y2>>1)+" "+(d.x2>>1)+" \n");
		}
	},

	kanpenOpenXML : function(){
		this.decodeCellQnum_shikaku_XMLBoard();
		this.decodeAnsSquareRoom_XMLAnswer();
	},
	kanpenSaveXML : function(){
		this.encodeCellQnum_shikaku_XMLBoard();
		this.encodeAnsSquareRoom_XMLAnswer();
	},

	decodeCellQnum_shikaku_XMLBoard : function(){
		this.decodeCellXMLBoard(function(cell, val){
			if     (val>=  1){ cell.qnum = val;}
			else if(val===-1){ cell.qnum = -2;}
		});
	},
	encodeCellQnum_shikaku_XMLBoard : function(){
		this.encodeCellXMLBoard(function(cell){
			var val = 0;
			if     (cell.qnum>=  1){ val = cell.qnum;}
			else if(cell.qnum===-2){ val = -1;}
			return val;
		});
	},

	decodeAnsSquareRoom_XMLAnswer : function(){
		var nodes = this.xmldoc.querySelectorAll('answer area');
		var bd = this.board, rdata = [];
		for(var i=0;i<nodes.length;i++){
			var node = nodes[i];
			var bx1 = 2*(+node.getAttribute('c0'))-1;
			var by1 = 2*(+node.getAttribute('r0'))-1;
			var bx2 = 2*(+node.getAttribute('c1'))-1;
			var by2 = 2*(+node.getAttribute('r1'))-1;
			for(var bx=bx1;bx<=bx2;bx+=2){ for(var by=by1;by<=by2;by+=2){
				rdata[bd.getc(bx,by).id] = i;
			}}
		}
		this.rdata2Border(false, rdata);
		bd.roommgr.rebuild();
	},
	encodeAnsSquareRoom_XMLAnswer : function(){
		var boardnode = this.xmldoc.querySelector('answer');
		var bd = this.board;
		bd.roommgr.rebuild();
		var rooms = bd.roommgr.components;
		for(var id=0;id<rooms.length;id++){
			var d = rooms[id].clist.getRectSize();
			boardnode.appendChild(this.createXMLNode('area',{r0:(d.y1>>1)+1,c0:(d.x1>>1)+1,r1:(d.y2>>1)+1,c1:(d.x2>>1)+1}));
		}
	}
},
//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checklist : [
		"checkNoNumber",
		"checkDoubleNumber",
		"checkRoomRect@shikaku",
		"checkAhoSquare@aho",
		"checkLshapeArea@aho",
		"checkNumberAndSize",
		"checkBorderDeadend+"
	],

	checkAhoSquare : function(){
		this.checkAllArea(this.board.roommgr, function(w,h,a,n){ return (n<0 || (n%3)===0 || w*h===a);}, "bkNotRect3");
	},
	checkLshapeArea : function(){
		var rooms = this.board.roommgr.components;
		for(var r=0;r<rooms.length;r++){
			var room = rooms[r];
			var clist = room.clist;
			var cell = clist.getQnumCell();
			if(cell.isnull){ continue;}

			var n = cell.qnum;
			if(n<0 || (n%3)!==0){ continue;}
			var d = clist.getRectSize();

			var clist2 = this.board.cellinside(d.x1,d.y1,d.x2,d.y2).filter(function(cell){ return (cell.room!==room);});
			var d2 = clist2.getRectSize();

			if( clist2.length>0 && (d2.cols*d2.rows===d2.cnt) && (d.x1===d2.x1 || d.x2===d2.x2) && (d.y1===d2.y1 || d.y2===d2.y2) ){ continue;}

			this.failcode.add("bkNotLshape3");
			if(this.checkOnly){ break;}
			clist.seterr(1);
		}
	}
},

FailCode:{
	bkNoNum  : ["数字の入っていない領域があります。","An area has no numbers."],
	bkNumGe2 : ["1つの領域に2つ以上の数字が入っています。","An area has plural numbers."],
	bkSizeNe : ["数字と領域の大きさが違います。","The size of the area is not equal to the number."],
	bkNotRect : ["四角形ではない領域があります。","An area is not rectangle."],
	bkNotRect3 : ["大きさが3の倍数ではないのに四角形ではない領域があります。","An area whose size is not multiples of three is not rectangle."],
	bkNotLshape3 : ["大きさが3の倍数である領域がL字型になっていません。","An area whose size is multiples of three is not L-shape."]
}
});