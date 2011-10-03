//
// パズル固有スクリプト部 遠い誓い版 toichika.js v3.4.0
//
pzprv3.custom.toichika = {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	inputedit : function(){
		if(this.mousestart || this.mousemove){
			if(this.mousestart){ this.checkBorderMode();}

			if(this.bordermode){ this.inputborder();}
			else               { this.inputarrow_cell();}
		}
		else if(this.mouseend && this.notInputted()){ this.inputqnum();}
	},
	inputplay : function(){
		if(this.mousestart || this.mousemove){
			if     (this.btn.Left) { this.inputarrow_cell();}
			else if(this.btn.Right){ this.inputDot();}
		}
		else if(this.mouseend && this.notInputted()){ this.inputqnum();}
	},

	inputDot : function(){
		var cell = this.getcell();
		if(cell.isnull || cell===this.mouseCell || cell.getQnum()!==-1){ return;}

		if(this.inputData===null){ this.inputData=(cell.getQsub()===1?0:1);}
		
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
	moveTarget : function(ca){
		if(this.isSHIFT){ return false;}
		return this.moveTCell(ca);
	},

	keyinput : function(ca){
		this.key_toichika(ca);
	},
	key_toichika : function(ca){
		if     (ca==='1'||ca==='w'||(this.isSHIFT && ca===this.KEYUP)){ ca='1';}
		else if(ca==='2'||ca==='s'||(this.isSHIFT && ca===this.KEYRT)){ ca='4';}
		else if(ca==='3'||ca==='z'||(this.isSHIFT && ca===this.KEYDN)){ ca='2';}
		else if(ca==='4'||ca==='a'||(this.isSHIFT && ca===this.KEYLT)){ ca='3';}
		else if(ca==='5'||ca==='q'||ca==='-')                         { ca='s1';}
		else if(ca==='6'||ca==='e'||ca===' ')                         { ca=' ';}
		this.key_inputqnum(ca);
	},
},

//---------------------------------------------------------
// 盤面管理系
Cell:{
	numberAsObject : true,

	maxnum : 4
},
Board:{
	isborder : 1,

	getPairedArrowsInfo : function(){
		var ainfo=[], isarrow=[];
		for(var c=0;c<this.cellmax;c++){ isarrow[c]=this.cell[c].isNum();}
		for(var c=0;c<this.cellmax;c++){
			var cell0 = this.cell[c];
			if(cell0.noNum()){ continue;}
			var pos=cell0.getaddr(), dir=cell0.getNum();

			while(1){
				pos.movedir(dir,2);
				var cell = pos.getc();
				if(cell.isnull){ ainfo.push([cell0.id]); break;}
				if(!!isarrow[cell.id]){
					if(cell.getNum()!==[0,this.DN,this.UP,this.RT,this.LT][dir]){ ainfo.push([cell0.id]);}
					else{ ainfo.push([cell.id,cell0.id]);}
					break;
				}
			}
		}
		return ainfo;
	},

	adjustBoardData : function(key,d){
		this.adjustCellArrow(key,d);
	}
},

AreaManager:{
	hasroom : true
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	setColors : function(){
		this.gridcolor = this.gridcolor_LIGHT;
		this.dotcolor = this.dotcolor_PINK;
	},
	paint : function(){
		this.drawBGCells();
		this.drawGrid();
		this.drawBorders();

		this.drawDotCells(true);
		this.drawCellArrows();
		this.drawHatenas();

		this.drawChassis();

		this.drawCursor();
	},
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	pzlimport : function(type){
		this.decodeBorder();
		this.decode4Cell_toichika();
	},
	pzlexport : function(type){
		this.encodeBorder();
		this.encode4Cell_toichika();
	},

	decode4Cell_toichika : function(){
		var c=0, i=0, bstr = this.outbstr;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if(this.include(ca,"1","4")){ bd.cell[c].qnum = parseInt(bstr.substr(i,1),10);}
			else if(ca==='.')           { bd.cell[c].qnum = -2;}
			else                        { c += (parseInt(ca,36)-5);}

			c++;
			if(c>=bd.cellmax){ break;}
		}
		this.outbstr = bstr.substr(i);
	},
	encode4Cell_toichika : function(){
		var cm="", count=0;
		for(var c=0;c<bd.cellmax;c++){
			var pstr = "", val = bd.cell[c].qnum;

			if     (val===-2)        { pstr = ".";}
			else if(val>=1 && val<=4){ pstr = val.toString(10);}
			else{ count++;}

			if(count===0){ cm += pstr;}
			else if(pstr || count===31){ cm+=((4+count).toString(36)+pstr); count=0;}
		}
		if(count>0){ cm+=(4+count).toString(36);}

		this.outbstr += cm;
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
	checkAns : function(){

		var rinfo = bd.areas.getRoomInfo();
		if( !this.checkDoubleNumber(rinfo) ){
			this.setAlert('1つの国に2つ以上の矢印が入っています。','A country has plural arrows.'); return false;
		}

		var ainfo = bd.getPairedArrowsInfo();
		if( !this.checkAdjacentCountries(rinfo, ainfo) ){
			this.setAlert('辺を共有する国にペアとなる矢印が入っています。','There are paired arrows in adjacent countries.'); return false;
		}

		if( !this.checkDirectionOfArrow(ainfo) ){
			this.setAlert('矢印の先にペアとなる矢印がいません。','There is not paired arrow in the direction of an arrow.'); return false;
		}

		if( !this.checkNoNumber(rinfo) ){
			this.setAlert('国に矢印が入っていません。','A country has no arrow.'); return false;
		}

		return true;
	},

	checkDirectionOfArrow : function(ainfo){
		var result = true;
		for(var i=0;i<ainfo.length;i++){
			if(ainfo[i].length===1){
				bd.cell[ainfo[i]].seterr(1);
				result = false;
			}
		}
		return result;
	},
	checkAdjacentCountries : function(rinfo, ainfo){
		// 隣接エリア情報を取得して、形式を変換
		var sides=bd.getSideAreaInfo(rinfo), adjs=[];
		for(var r=1;r<=rinfo.max-1;r++){
			adjs[r]=[];
			for(var i=0;i<sides[r].length;i++){ adjs[r][sides[r][i]]=true;}
			for(var s=r+1;s<=rinfo.max;s++){ if(!adjs[r][s]){ adjs[r][s]=false;}}
		}

		// ここから実際の判定
		var result = true;
		for(var i=0;i<ainfo.length;i++){
			if(ainfo[i].length===1){ continue;}
			var r1 = rinfo.id[ainfo[i][0]], r2 = rinfo.id[ainfo[i][1]];
			if((r1<r2 ? adjs[r1][r2] : adjs[r2][r1])>0){
				rinfo.getclist(r1).seterr(1);
				rinfo.getclist(r2).seterr(1);
				result = false;
			}
		}
		return result;
	}
}
};
