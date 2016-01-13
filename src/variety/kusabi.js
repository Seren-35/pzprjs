//
// パズル固有スクリプト部 クサビリンク版 kusabi.js
//
(function(pidlist, classbase){
	if(typeof pzpr!=='undefined'){ pzpr.classmgr.makeCustom(pidlist, classbase);}
	else{ module.exports = [pidlist, classbase];}
})
(['kusabi'], {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	mouseinput : function(){
		if(this.puzzle.playmode){
			if(this.btn==='left'){
				if(this.mousestart || this.mousemove){ this.inputLine();}
				else if(this.mouseend && this.notInputted()){ this.inputpeke();}
			}
			else if(this.btn==='right'){
				if(this.mousestart || this.mousemove){ this.inputpeke();}
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
Cell:{
	numberAsObject : true,

	maxnum : 3
},
Board:{
	hasborder : 1
},

LineGraph:{
	enabled : true,
	makeClist : true
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	hideHatena : true,

	gridcolor_type : "LIGHT",
	circleratio : [0.45, 0.40],

	paint : function(){
		this.drawBGCells();
		this.drawGrid();

		this.drawPekes();
		this.drawLines();

		this.drawCircles();
		this.drawNumbers();

		this.drawChassis();

		this.drawTarget();
	},

	drawNumber1 : function(cell){
		var g = this.context, text = {1:"同",2:"短",3:"長"}[cell.qnum] || "";
		g.vid = "cell_text_"+cell.id;
		if(!!text){
			g.fillStyle = this.fontcolor;
			this.disptext(text, cell.bx*this.bw, cell.by*this.bh, {ratio:[0.65]});
		}
		else{ g.vhide();}
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	decodePzpr : function(type){
		this.decodeNumber10();
	},
	encodePzpr : function(type){
		this.encodeNumber10();
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		this.decodeCellQnum();
		this.decodeBorderLine();
	},
	encodeData : function(){
		this.encodeCellQnum();
		this.encodeBorderLine();
	}
},

//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checklist : [
		"checkBranchLine",
		"checkCrossLine",
		"checkTripleObject",
		"checkLineOverLetter",
		"checkKusabiShape",
		"checkProperLetter",
		"checkCurveOver",
		"checkCurveLack",
		"checkLengthNotEq",
		"checkLengthWrong",
		"checkLineShapeDeadend",
		"checkDisconnectLine",
		"checkNoLineObject+"
	],

	checkKusabiShape : function(){
		this.checkLineShape(function(path){ return (path.ccnt===2 && path.dir1!==path.dir2);}, "lcNotKusabi");
	},
	checkProperLetter : function(){
		this.checkLineShape(function(path){
			var cell1=path.cells[0], cell2=path.cells[1], qn1=cell1.qnum, qn2=cell2.qnum;
			return (!cell2.isnull && path.ccnt===2 && !((qn1===1&&qn2===1) || (qn1===2&&qn2===3) || (qn1===3&&qn2===2) || qn1===-2 || qn2===-2));
		}, "lcInvalid");
	},
	checkCurveOver : function(){
		this.checkLineShape(function(path){ return (path.ccnt>2);}, "lcCurveGt2");
	},
	checkCurveLack : function(){
		this.checkLineShape(function(path){ return (!path.cells[1].isnull && path.ccnt<2);}, "lcCurveLt2");
	},
	checkLengthNotEq : function(){
		this.checkLineShape(function(path){
			var cell1=path.cells[0], cell2=path.cells[1], qn1=cell1.qnum, qn2=cell2.qnum;
			return (!cell2.isnull && path.ccnt===2 && (qn1===1 || qn2===1) && path.length[0]!==path.length[2]);
		}, "lcLenInvNe");
	},
	checkLengthWrong : function(){
		this.checkLineShape(function(path){
			var cell1=path.cells[0], cell2=path.cells[1], qn1=cell1.qnum, qn2=cell2.qnum, length=path.length;
			return (!cell2.isnull && path.ccnt===2 && (((qn1===2||qn2===3) && length[0]>=length[2]) || ((qn1===3||qn2===2) && length[0]<=length[2])));
		}, "lcLenInvDiff");
	}
},

FailCode:{
	lcOnNum : ["○の上を線が通過しています。","A line goes through a circle."],
	lcIsolate : ["○につながっていない線があります。","A line doesn't connect any circle."],
	lcTripleNum : ["3つ以上の○が繋がっています。","Three or more objects are connected."],
	lcNotKusabi : ["丸がコの字型に繋がっていません。","The shape of a line is not correct."],
	lcInvalid  : ["繋がる丸が正しくありません。","The type of connected circle is wrong."],
	lcCurveGt2 : ["線が2回以上曲がっています。","A line turns twice or more."],
	lcCurveLt2 : ["線が2回曲がっていません。","A line turns only once or lower."],
	lcLenInvNe : ["線の長さが同じではありません。","The length of lines is differnet."],
	lcLenInvDiff : ["線の長短の指示に反してます。","The length of lines is not suit for the label of object."],
	nmNoLine : ["どこにもつながっていない○があります。","A circle is not connected another object."]
}
});