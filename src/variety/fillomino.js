//
// パズル固有スクリプト部 フィルオミノ版 fillomino.js
//
(function(pidlist, classbase){
	if(typeof pzpr!=='undefined'){ pzpr.classmgr.makeCustom(pidlist, classbase);}
	else{ module.exports = [pidlist, classbase];}
})
(['fillomino'], {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	mouseinput : function(){
		if(this.puzzle.playmode && (this.mousestart || this.mousemove)){
			if(this.btn==='left'){
				if(this.isBorderMode()){ this.inputborder();}
				else                   { this.dragnumber_fillomino();}
			}
			else if(this.btn==='right'){ this.inputQsubLine();}
		}

		if(this.mouseend && this.notInputted()){
			this.mouseCell = this.board.emptycell;
			this.inputqnum();
		}
	},

	dragnumber_fillomino : function(){
		var cell = this.getcell();
		if(cell.isnull||cell===this.mouseCell){ return;}

		if(this.inputData===null){
			this.inputData = cell.getNum();
			if(this.inputData===-1){ this.inputData=-2;}
			this.mouseCell = cell;
			return;
		}
		else if(this.inputData===-2){
			this.inputData=(cell.getNum()===-1?-3:-1);
		}

		if(this.inputData>=-1){
			cell.setAnum(this.inputData);
			cell.draw();
		}
		else if(this.inputData<=-3){
			var cell2 = this.mouseCell;
			var border = this.board.getb(((cell.bx+cell2.bx)>>1), ((cell.by+cell2.by)>>1));
			if(this.inputData===-3){ this.inputData=(border.qsub===1?-5:-4);}
			if(!border.isnull){
				border.setQsub(this.inputData===-4?1:0);
				border.draw();
			}
		}
		this.mouseCell = cell;
	}
},

//---------------------------------------------------------
// キーボード入力系
KeyEvent:{
	enablemake : true,
	enableplay : true,
	moveTarget : function(ca){
		if(this.puzzle.playmode && (this.isCTRL || this.isX || this.isZ)){
			return this.move_fillomino(ca);
		}
		return this.moveTCell(ca);
	},

	move_fillomino : function(ca){
		var cell = this.cursor.getc();
		if(cell.isnull){ return false;}

		var adc=cell.adjacent, adb=cell.adjborder;
		var nc, nb, dir=cell.NDIR;
		switch(ca){
			case 'up':    nc=adc.top;    nb=adb.top;    dir=cell.UP; break;
			case 'down':  nc=adc.bottom; nb=adb.bottom; dir=cell.DN; break;
			case 'left':  nc=adc.left;   nb=adb.left;   dir=cell.LT; break;
			case 'right': nc=adc.right;  nb=adb.right;  dir=cell.RT; break;
			default: return false;
		}
		if(!nc.isnull){
			var isMoved = (this.isCTRL || this.isX || this.isZ);
			if(!isMoved){ return false;}

			if(this.isCTRL)  { if(!nb.isnull){ nb.setQsub((nb.qsub===0)?1:0);    this.cursor.setaddr(nc);}}
			else if(this.isZ){ if(!nb.isnull){ nb.setQans((!nb.isBorder()?1:0));                         }}
			else if(this.isX){ if(!nc.isnull){ nc.setAnum(cell.getNum());        this.cursor.setaddr(nc);}}

			cell.draw();
			this.stopEvent();	/* カーソルを移動させない */
			return true;
		}
		return false;
	}
},

//---------------------------------------------------------
// 盤面管理系
Board:{
	hasborder : 1
},

AreaRoomGraph:{
	enabled : true,
	isedgevalidbylinkobj : function(border){
		if(border.isBorder()){ return false;}
		return border.sidecell[0].getNum() === border.sidecell[1].getNum();
	},
	isedgevalidbynodeobj : function(cell1, cell2){
		if(this.board.getb(((cell1.bx+cell2.bx)>>1), ((cell1.by+cell2.by)>>1)).isBorder()){ return false;}
		return cell1.getNum() === cell2.getNum();
	},

	setExtraData : function(component){
		var clist = component.clist = new this.klass.CellList(component.getnodeobjs());
		
		var emptycell=0, nums = [], numkind=0, filled=-1;
		for(var i=0;i<clist.length;i++){
			var num = clist[i].getNum();
			if(num===-1){ emptycell++;}
			else if(isNaN(nums[num])){ numkind++; filled=num; nums[num]=1;}
			else{ nums[num]++;}
		}
		component.number = (numkind===1 ? filled : -1);
	}
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	gridcolor_type : "DLIGHT",

	bordercolor_func : "qans",

	paint : function(){
		this.drawBGCells();
		this.drawDashedGrid();

		this.drawNumbers();

		this.drawBorders();
		this.drawBorderQsubs();

		this.drawChassis();

		this.drawCursor();
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
		this.decodeCellAnumsub();
		this.decodeBorderAns();
	},
	encodeData : function(){
		this.encodeCellQnum();
		this.encodeCellAnumsub();
		this.encodeBorderAns();
	},

	kanpenOpen : function(){
		this.decodeCellQnum_kanpen();
		this.decodeCellAnum_kanpen();

		this.inputBorderFromNumber(); // 境界線を自動入力
	},
	kanpenSave : function(){
		this.encodeCellQnum_kanpen();
		this.encodeCellAnum_kanpen();
	},

	inputBorderFromNumber : function(){
		var bd = this.board;
		for(var id=0;id<bd.border.length;id++){
			var border = bd.border[id], cell1 = border.sidecell[0], cell2 = border.sidecell[1];
			border.qans = 0;
			if(!cell1.isnull && !cell2.isnull){
				var qa1 = cell1.getNum(), qa2 = cell2.getNum();
				if(qa1!==-1 && qa2!==-1 && qa1!==qa2){ border.qans = 1;}
			}
		}
	},

	kanpenOpenXML : function(){
		this.decodeCellQnum_XMLBoard();
		this.decodeCellAnum_XMLAnswer();

		this.inputBorderFromNumber(); // 境界線を自動入力
	},
	kanpenSaveXML : function(){
		this.encodeCellQnum_XMLBoard();
		this.encodeCellAnum_XMLAnswer();
	},

	UNDECIDED_NUM_XML : 0
},

//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checklist : [
		"checkLargeArea",
		"checkSideAreaNumberSize",
		"checkSmallArea",
		"checkNoNumCell+"
	],

	checkSideAreaNumberSize : function(){
		this.checkSideAreaSize(function(area){ return area.number;}, "bsSameNum");
	},

	checkSmallArea : function(){ this.checkAllErrorRoom(function(area){ return !(area.number>area.clist.length);}, "bkSizeLt");}, // jshint ignore:line
	checkLargeArea : function(){ this.checkAllErrorRoom(function(area){ return !(area.number<area.clist.length && area.number>0);}, "bkSizeGt");},
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
	bkSizeLt : ["ブロックの大きさより数字のほうが大きいです。","A number is bigger than the size of block."],
	bkSizeGt : ["ブロックの大きさよりも数字が小さいです。","A number is smaller than the size of block."],
	bsSameNum : ["同じ数字のブロックが辺を共有しています。","Adjacent blocks have the same number."]
}
});