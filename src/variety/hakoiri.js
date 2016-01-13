//
// パズル固有スクリプト部 はこいり○△□版 hakoiri.js
//
(function(pidlist, classbase){
	if(typeof pzpr!=='undefined'){ pzpr.classmgr.makeCustom(pidlist, classbase);}
	else{ module.exports = [pidlist, classbase];}
})
(['hakoiri'], {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	mouseinput : function(){
		if(this.puzzle.playmode){
			if(this.btn==='left'){
				if(this.mousestart){ this.inputqnum();}
			}
			else if(this.btn==='right'){
				if(this.mousemove){ this.inputDot();}
			}
		}
		else if(this.puzzle.editmode){
			if(this.mousestart || this.mousemove){
				this.inputborder();
			}
		}
		
		if(this.mouseend && this.notInputted()){
			this.inputqnum();
		}
	},

	inputDot : function(){
		var cell = this.getcell();
		if(cell.isnull || cell===this.mouseCell || cell.qnum!==-1){ return;}

		if(this.inputData===null){ this.inputData=(cell.qsub===1?0:1);}

		cell.setAnum(-1);
		cell.setQsub(this.inputData===1?1:0);
		this.mouseCell = cell;
		cell.draw();
	}
},

//---------------------------------------------------------
// キーボード入力系
KeyEvent:{
	enablemake : true,
	enableplay : true,

	keyinput : function(ca){
		this.key_hakoiri(ca);
	},
	key_hakoiri : function(ca){
		if     (ca==='1'||ca==='q'||ca==='a'||ca==='z'){ ca='1';}
		else if(ca==='2'||ca==='w'||ca==='s'||ca==='x'){ ca='2';}
		else if(ca==='3'||ca==='e'||ca==='d'||ca==='c'){ ca='3';}
		else if(ca==='4'||ca==='r'||ca==='f'||ca==='v'){ ca='s1';}
		else if(ca==='5'||ca==='t'||ca==='g'||ca==='b'){ ca=' ';}
		this.key_inputqnum(ca);
	}
},

//---------------------------------------------------------
// 盤面管理系
Cell:{
	numberAsObject : true,

	maxnum : 3
},
Board:{
	hasborder : 1
},

AreaNumberGraph:{
	enabled : true
},
AreaRoomGraph:{
	enabled : true
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	bcolor_type : "GREEN",
	dotcolor_type : "PINK",

	bbcolor : "rgb(127, 127, 127)",

	paint : function(){
		this.drawBGCells();
		this.drawGrid();
		this.drawBorders();

		this.drawDotCells(true);
		this.drawQnumMarks();
		this.drawHatenas();

		this.drawChassis();

		this.drawCursor();
	},

	drawQnumMarks : function(){
		var g = this.vinc('cell_mark', 'auto');

		g.lineWidth = 2;
		var rsize = this.cw*0.30, tsize=this.cw*0.26;
		var clist = this.range.cells;
		for(var i=0;i<clist.length;i++){
			var cell = clist[i];

			g.vid = "c_mk_"+cell.id;
			g.strokeStyle = this.getCellNumberColor(cell);
			var px = cell.bx*this.bw, py = cell.by*this.bh;
			switch(cell.getNum()){
			case 1:
				g.strokeCircle(px, py, rsize);
				break;
			case 2:
				g.beginPath();
				g.setOffsetLinePath(px, py, 0,-tsize, -rsize,tsize, rsize,tsize, true);
				g.stroke();
				break;
			case 3:
				g.strokeRectCenter(px, py, rsize, rsize);
				break;
			default:
				g.vhide();
				break;
			}
		}
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	decodePzpr : function(type){
		this.decodeBorder();
		this.decodeNumber10();
	},
	encodePzpr : function(type){
		this.encodeBorder();
		this.encodeNumber10();
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		this.decodeAreaRoom();
		this.decodeCellQnum();
		this.decodeCellAnumsub();
	},
	encodeData : function(){
		this.encodeAreaRoom();
		this.encodeCellQnum();
		this.encodeCellAnumsub();
	}
},

//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checklist : [
		"checkAroundMarks",
		"checkOverFourMarksInBox",
		"checkDifferentNumberInRoom",
		"checkConnectNumber",
		"checkAllMarkInBox"
	],

	checkOverFourMarksInBox : function(){
		this.checkAllBlock(this.board.roommgr, function(cell){ return cell.isNum();}, function(w,h,a,n){ return (a<=3);}, "bkNumGt3");
	},
	checkAllMarkInBox : function(){
		this.checkAllBlock(this.board.roommgr, function(cell){ return cell.isNum();}, function(w,h,a,n){ return (a>=3);}, "bkNumLt3");
	},

	checkAroundMarks : function(){
		var bd = this.board;
		for(var c=0;c<bd.cell.length;c++){
			var cell = bd.cell[c], num = cell.getNum();
			if(num<0){ continue;}
			var target=0, clist=new this.klass.CellList();
			var func = function(cell){ return (!cell.isnull && num===cell.getNum());};
			// 右・左下・下・右下だけチェック
			clist.add(cell);
			target = cell.relcell( 2,0); if(func(target)){ clist.add(target);}
			target = cell.relcell( 0,2); if(func(target)){ clist.add(target);}
			target = cell.relcell(-2,2); if(func(target)){ clist.add(target);}
			target = cell.relcell( 2,2); if(func(target)){ clist.add(target);}
			if(clist.length<=1){ continue;}
			
			this.failcode.add("nmAround");
			if(this.checkOnly){ break;}
			clist.seterr(1);
		}
	}
},

FailCode:{
	bkDupNum : ["1つのハコに同じ記号が複数入っています。","A box has same plural marks."],
	bkNumGt3 : ["1つのハコに4つ以上の記号が入っています。","A box has four or more marks."],
	bkNumLt3 : ["1つのハコに2つ以下の記号しか入っていません。","A box has tow or less marks."],
	nmDivide : ["タテヨコにつながっていない記号があります。","Marks are devided."],
	nmAround : ["同じ記号がタテヨコナナメに隣接しています。","Same marks are adjacent."]
}
});