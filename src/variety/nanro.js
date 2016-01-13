//
// パズル固有スクリプト部 ナンロー版 nanro.js
//
(function(pidlist, classbase){
	if(typeof pzpr!=='undefined'){ pzpr.classmgr.makeCustom(pidlist, classbase);}
	else{ module.exports = [pidlist, classbase];}
})
(['nanro'], {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	mouseinput : function(){
		if(this.puzzle.playmode){
			if(this.mousestart || this.mousemove){
				if     (this.btn==='left') { this.dragnumber_nanro();}
				else if(this.mousemove && this.btn==='right'){ this.inputDot_nanro();}
			}
			else if(this.mouseend && this.notInputted()){
				this.mouseCell = this.board.emptycell;
				this.inputqnum();
			}
		}
		else if(this.puzzle.editmode){
			if(this.mousestart || this.mousemove){ this.inputborder();}
			else if(this.mouseend && this.notInputted()){
				this.mouseCell = this.board.emptycell;
				this.inputqnum();
			}
		}
	},

	dragnumber_nanro : function(){
		var cell = this.getcell();
		if(cell.isnull||cell===this.mouseCell){ return;}
		if(this.mouseCell.isnull){
			this.inputData = cell.getNum();
			if     (this.inputData===-2){ this.inputData=null;}
			else if(this.inputData===-1){
				if     (cell.qsub===1){ this.inputData=-2;}
				else if(cell.qsub===2){ this.inputData=-3;}
			}
			this.mouseCell = cell;
		}
		else if(cell.qnum===-1){
			cell.setNum(this.inputData);
			this.mouseCell = cell;
			cell.draw();
		}
	},
	inputDot_nanro : function(){
		var cell = this.getcell();
		if(cell.isnull || cell===this.mouseCell || cell.isNum()){ return;}
		if(this.inputData===null){ this.inputData = (cell.qsub===2?0:2);}
		if     (this.inputData===2){ cell.setAnum(-1); cell.setQsub(2);}
		else if(this.inputData===0){ cell.setAnum(-1); cell.setQsub(0);}
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
		this.key_view(ca);
	},
	key_view : function(ca){
		if(this.puzzle.playmode){
			var cell = this.cursor.getc();
			if     (ca==='q'||ca==='a'||ca==='z')          { ca='s1';}
			else if(ca==='w'||ca==='s'||ca==='x')          { ca='s2';}
			else if(ca==='e'||ca==='d'||ca==='c'||ca==='-'){ ca=' '; }
			else if(ca==='1' && cell.anum===1)             { ca='s1';}
			else if(ca==='2' && cell.anum===2)             { ca='s2';}
		}
		this.key_inputqnum(ca);
	}
},

//---------------------------------------------------------
// 盤面管理系
Cell:{
	numberWithMB : true,

	maxnum : function(){
		return this.room.clist.length;
	}
},
Board:{
	cols : 8,
	rows : 8,

	hasborder : 1
},

AreaNumberGraph:{
	enabled : true
},
AreaRoomGraph:{
	enabled : true,

	// オーバーライド
	setExtraData : function(component){
		var clist = component.clist = new this.klass.CellList(component.getnodeobjs());
		var nums = [];
		var numkind=0, filled=-1;
		for(var i=0;i<clist.length;i++){
			var num = clist[i].getNum();
			if(num!==-1){
				if(isNaN(nums[num])){ numkind++; filled=num; nums[num]=1;}
				else{ nums[num]++;}
			}
		}
		component.number  = filled;
		component.numcnt  = nums[filled];
		component.numkind = numkind;
	}
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	gridcolor_type : "LIGHT",

	paint : function(){
		this.drawBGCells();
		this.drawGrid();

		this.drawMBs();
		this.drawNumbers();

		this.drawBorders();

		this.drawChassis();

		this.drawCursor();
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	decodePzpr : function(type){
		this.decodeBorder();
		this.decodeNumber16();
	},
	encodePzpr : function(type){
		this.encodeBorder();
		this.encodeNumber16();
	},

	decodeKanpen : function(){
		this.puzzle.fio.decodeAreaRoom();
		this.puzzle.fio.decodeCellQnum_kanpen();
	},
	encodeKanpen : function(){
		this.puzzle.fio.encodeAreaRoom();
		this.puzzle.fio.encodeCellQnum_kanpen();
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
		"check2x2NumberCell",
		"checkSideAreaNumber",
		"checkNotMultiNum",
		"checkNumCountOver",
		"checkConnectNumber",
		"checkNumCountLack",
		"checkNoEmptyArea"
	],

	check2x2NumberCell : function(){
		this.check2x2Block(function(cell){ return cell.isNum();}, "nm2x2");
	},
	checkSideAreaNumber : function(){
		this.checkSideAreaCell(function(cell1,cell2){ return cell1.sameNumber(cell2);}, false, "cbSameNum");
	},

	checkNotMultiNum  : function(){ this.checkAllErrorRoom(function(area){ return !(area.numkind>1);}, "bkPlNum");},	/* jshint ignore:line */
	checkNumCountLack : function(){ this.checkAllErrorRoom(function(area){ return !(area.numkind===1 && area.number>area.numcnt);}, "nmCountLt");},
	checkNumCountOver : function(){ this.checkAllErrorRoom(function(area){ return !(area.numkind===1 && area.number<area.numcnt);}, "nmCountGt");},
	checkNoEmptyArea  : function(){ this.checkAllErrorRoom(function(area){ return area.numkind!==0;}, "bkNoNum");},
	checkAllErrorRoom : function(evalfunc, code){
		var rooms = this.board.roommgr.components;
		for(var id=0;id<rooms.length;id++){
			var area = rooms[id];
			if( !area || evalfunc(area) ){ continue;}
			
			this.failcode.add(code);
			if(this.checkOnly){ break;}
			area.clist.seterr(1);
		}
	}
},

FailCode:{
	bkNoNum : ["数字が含まれていないブロックがあります。","A block has no number."],
	nm2x2   : ["数字が2x2のかたまりになっています。","There is a 2x2 block of numbers."],
	cbSameNum : ["同じ数字が境界線を挟んで隣り合っています。","Adjacent blocks have the same number."],
	nmCountGt : ["入っている数字の数が数字より多いです。","A number is bigger than the size of block."],
	nmCountLt : ["入っている数字の数が数字より少ないです。","A number is smaller than the size of block."]
}
});