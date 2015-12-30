//
// パズル固有スクリプト部 カックロ版 kakuro.js v3.4.1
//
pzpr.classmgr.makeCustom(['kakuro'], {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	mouseinput : function(){
		if(this.puzzle.playmode){
			if(this.mousestart){ this.inputqnum();}
		}
		else if(this.puzzle.editmode){
			if(this.mousestart){ this.input51();}
		}
	}
},

//---------------------------------------------------------
// キーボード入力系
KeyEvent:{
	enablemake : true,
	enableplay : true,

	keyinput : function(ca){
		if     (this.puzzle.editmode){ this.inputnumber51(ca,{2:45,4:45});}
		else if(this.puzzle.playmode){ this.key_inputqnum(ca);}
	}
},

TargetCursor:{
	adjust_modechange : function(){
		if(this.puzzle.playmode){
			if(this.bx<1){ this.bx = 1;}
			if(this.by<1){ this.by = 1;}
		}
	}
},

//---------------------------------------------------------
// 盤面管理系
Cell:{
	qnum : 0,
	qnum2 : 0,

	noNum : function(){ return !this.isnull && (this.qnum===0 && this.qnum2===0 && this.anum===-1);},

	/* 問題の0入力は↓の特別処理で可能にしてます */
	disInputHatena : true,

	maxnum : 9,

	// この関数は回答モードでしか呼ばれないはず、
	getNum : function(){ return this.anum;},
	setNum : function(val){ this.setAnum(val>0 ? val : -1);},

	// 問題入力モードは0でも入力できるようにする
	prehook : {
		qnum  : function(num){ return false;},
		qnum2 : function(num){ return false;}
	}
},

EXCell:{
	ques : 51,
	qnum : 0,
	qnum2 : 0
},

Board:{
	cols : 11,
	rows : 11,

	hasborder : 1,
	hasexcell : 1
},
BoardExec:{
	adjustBoardData : function(key,d){
		this.adjustQues51_1(key,d);
	},
	adjustBoardData2 : function(key,d){
		this.adjustQues51_2(key,d);
	}
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	ttcolor : "rgb(255,255,127)",

	paint : function(){
		this.drawBGCells();
		this.drawBGEXcells();
		this.drawQues51();

		this.drawGrid();
		this.drawBorders();

		this.drawChassis_ex1(false);

		this.drawNumbersOn51();
		this.drawNumbers_kakuro();

		this.drawCursor();
	},

	// オーバーライド drawBGCells用
	getBGCellColor : function(cell){
		if     (cell.error===1){ return this.errbcolor1;}
		else if(cell.ques===51){ return "rgb(192,192,192)";}
		return null;
	},
	getBGEXcellColor : function(excell){
		if(excell.error){ return this.errbcolor1;   }
		else            { return "rgb(192,192,192)";}
	},
	// オーバーライド 境界線用
	getBorderColor : function(border){
		var cell1 = border.sidecell[0], cell2 = border.sidecell[1];
		if(!cell1.isnull && !cell2.isnull && ((cell1.ques===51)!==(cell2.ques===51))){
			return this.quescolor;
		}
		return null;
	},

	drawNumbers_kakuro : function(){
		var g = this.vinc('cell_number', 'auto');

		var clist = this.range.cells;
		for(var i=0;i<clist.length;i++){
			var cell = clist[i], px = cell.bx*this.bw, py = cell.by*this.bh;
			g.vid = "cell_text_anum"+cell.id;
			if(!cell.is51cell() && cell.anum>0){
				g.fillStyle = (cell.error===1 ? this.fontErrcolor : this.fontAnscolor);
				this.disptext(""+cell.anum, px, py);
			}
			else{ g.vhide();}
		}
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	decodePzpr : function(type){
		this.decodeKakuro();
	},
	encodePzpr : function(type){
		this.encodeKakuro();
	},

	decodeKanpen : function(){
		this.puzzle.fio.decodeCellQnum51_kanpen();
	},
	encodeKanpen : function(){
		this.puzzle.fio.encodeCellQnum51_kanpen();
	},

	decodeKakuro : function(){
		// 盤面内数字のデコード
		var c=0, a=0, bstr = this.outbstr, bd = this.board;
		for(var i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i), cell=bd.cell[c];
			if(ca>='k' && ca<='z'){ c+=(parseInt(ca,36)-19);}
			else{
				cell.ques = 51;
				if(ca!=='.'){
					cell.qnum2 = this.decval(ca);
					cell.qnum  = this.decval(bstr.charAt(i+1));
					i++;
				}
				c++;
			}
			if(c>=bd.cellmax){ a=i+1; break;}
		}

		// 盤面外数字のデコード
		var i=a;
		for(var bx=1;bx<bd.maxbx;bx+=2){
			if(!bd.getc(bx,1).is51cell()){
				bd.getex(bx,-1).qnum2 = this.decval(bstr.charAt(i));
				i++;
			}
		}
		for(var by=1;by<bd.maxby;by+=2){
			if(!bd.getc(1,by).is51cell()){
				bd.getex(-1,by).qnum = this.decval(bstr.charAt(i));
				i++;
			}
		}

		this.outbstr = bstr.substr(a);
	},
	encodeKakuro : function(type){
		var cm="", bd = this.board;

		// 盤面内側の数字部分のエンコード
		var count=0;
		for(var c=0;c<bd.cellmax;c++){
			var pstr="", cell=bd.cell[c];

			if(cell.ques===51){
				if(cell.qnum<=0 && cell.qnum2<=0){ pstr = ".";}
				else{ pstr = ""+this.encval(cell.qnum2)+this.encval(cell.qnum);}
			}
			else{ count++;}

			if     (count===0){ cm += pstr;}
			else if(pstr || count===16){ cm += ((count+19).toString(36)+pstr); count=0;}
		}
		if(count>0){ cm += (count+19).toString(36);}

		// 盤面外側の数字部分のエンコード
		for(var bx=1;bx<bd.maxbx;bx+=2){
			if(!bd.getc(bx,1).is51cell()){
				cm+=this.encval(bd.getex(bx,-1).qnum2);
			}
		}
		for(var by=1;by<bd.maxby;by+=2){
			if(!bd.getc(1,by).is51cell()){
				cm+=this.encval(bd.getex(-1,by).qnum);
			}
		}

		this.outbstr += cm;
	},

	decval : function(ca){
		if     (ca>='0'&&ca<='9'){ return parseInt(ca,36);}
		else if(ca>='a'&&ca<='j'){ return parseInt(ca,36);}
		else if(ca>='A'&&ca<='Z'){ return parseInt(ca,36)+10;}
		return 0;
	},
	encval : function(val){
		if     (val>= 1&&val<=19){ return val.toString(36).toLowerCase();}
		else if(val>=20&&val<=45){ return (val-10).toString(36).toUpperCase();}
		return "0";
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		this.decodeCellQnum51();
		this.decodeCellAnumsub();
	},
	encodeData : function(){
		this.encodeCellQnum51();
		this.encodeCellAnumsub();
	},

	kanpenOpen : function(){
		this.decodeCellQnum51_kanpen();
		this.decodeQans_kanpen();
	},
	kanpenSave : function(){
		this.encodeCellQnum51_kanpen();
		this.datastr += "\n";
		this.encodeQans_kanpen();
	},

	decodeCellQnum51_kanpen : function(){
		var bd = this.board;
		for(;;){
			var data = this.readLine();
			if(!data){ break;}

			var item = data.split(" ");
			if(item.length<=1){ return;}
			else if(item[0]==="0" && item[1]==="0"){ }
			else if(item[0]==="0" || item[1]==="0"){
				var excell = bd.getex((+item[1])*2-1,(+item[0])*2-1);
				if     (item[0]==="0"){ excell.qnum2 = +item[3];}
				else if(item[1]==="0"){ excell.qnum  = +item[2];}
			}
			else{
				var cell = bd.getc((+item[1])*2-1,(+item[0])*2-1);
				cell.ques = 51;
				cell.qnum2 = +item[3];
				cell.qnum  = +item[2];
			}
		}
	},
	encodeCellQnum51_kanpen : function(){
		var bd = this.board;
		for(var by=bd.minby+1;by<bd.maxby;by+=2){ for(var bx=bd.minbx+1;bx<bd.maxbx;bx+=2){
			var item=[(by+1)>>1,(bx+1)>>1,0,0];

			if(bx===-1&&by===-1){ }
			else if(bx===-1||by===-1){
				var excell = bd.getex(bx,by);
				if(bx===-1){ item[2]=excell.qnum;}
				if(by===-1){ item[3]=excell.qnum2;}
			}
			else{
				var cell = bd.getc(bx,by);
				if(cell.ques!==51){ continue;}
				item[2]=cell.qnum;
				item[3]=cell.qnum2;
			}
			this.datastr += (item.join(" ")+"\n");
		}}
	},

	decodeQans_kanpen : function(){
		var bd = this.board, barray = this.readLines(bd.rows+1);
		for(var by=bd.minby+1;by<bd.maxby;by+=2){
			if(((by+1)>>1)>=barray.length){ break;}
			var arr = barray[(by+1)>>1].split(" ");
			for(var bx=bd.minbx+1;bx<bd.maxbx;bx+=2){
				if(arr[(bx+1)>>1]===''){ continue;}
				var cell = bd.getc(bx,by);
				if(!cell.isnull && arr[(bx+1)>>1]!=="." && arr[(bx+1)>>1]!=="0"){
					cell.anum = +arr[(bx+1)>>1];
				}
			}
		}
	},
	encodeQans_kanpen : function(){
		var bd = this.board;
		for(var by=bd.minby+1;by<bd.maxby;by+=2){
			for(var bx=bd.minbx+1;bx<bd.maxbx;bx+=2){
				var cell = bd.getc(bx,by);
				if(cell.isnull){ this.datastr += ". ";}
				else if(cell.ques===51){ this.datastr += ". ";}
				else if(cell.anum  > 0){ this.datastr += (cell.anum+" ");}
				else                   { this.datastr += "0 ";}
			}
			if(by<bd.maxby-1){ this.datastr += "\n";}
		}
	},

	kanpenOpenXML : function(){
		this.decodeCellQnum51_XMLBoard();
		this.decodeCellAnum_kakuro_XMLAnswer();
	},
	kanpenSaveXML : function(){
		this.encodeCellQnum51_XMLBoard();
		this.encodeCellAnum_kakuro_XMLAnswer();
	},

	decodeCellQnum51_XMLBoard : function(){
		var nodes = this.xmldoc.querySelectorAll('board wall');
		var bd = this.board;
		for(var i=0;i<nodes.length;i++){
			var node = nodes[i];
			var bx = 2*(+node.getAttribute('c'))-3;
			var by = 2*(+node.getAttribute('r'))-3;
			var a = +node.getAttribute('a');
			var b = +node.getAttribute('b');
			var piece = bd.getobj(bx,by); /* cell or excell */
			piece.ques = 51;
			if(a>0){ piece.qnum  = a;}
			if(b>0){ piece.qnum2 = b;}
		}
	},
	encodeCellQnum51_XMLBoard : function(){
		var boardnode = this.xmldoc.querySelector('board');
		var bd = this.board;
		for(var by=-1;by<bd.maxby;by+=2){
			for(var bx=-1;bx<bd.maxbx;bx+=2){
				var piece = bd.getobj(bx,by); /* cell or excell */
				if(piece.ques===51){
					var a = (piece.qnum  > 0 ? piece.qnum  : 0);
					var b = (piece.qnum2 > 0 ? piece.qnum2 : 0);
					boardnode.appendChild(this.createXMLNode('wall',{r:((by+3)>>1),c:((bx+3)>>1),a:a,b:b}));
				}
			}
		}
	},

	PBOX_ADJUST : 2,
	decodeCellAnum_kakuro_XMLAnswer : function(){
		this.decodeCellXMLArow(function(cell, name){
			if(name!=='n-1' && name!=='n0' && cell.ques!==51){ cell.anum = +name.substr(1);}
		});
	},
	encodeCellAnum_kakuro_XMLAnswer : function(){
		this.encodeCellXMLArow(function(cell){
			if(cell.ques===0 && cell.anum===-1){ return 'n0';}
			return 'n'+cell.anum;
		});
	}
},

//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checklist : [
		"checkSameNumberInLine",
		"checkSumOfNumberInLine",
		"checkNoNumCell+"
	],

	checkSameNumberInLine : function(){
		this.checkRowsColsPartly(this.isSameNumber, function(cell){ return cell.is51cell();}, "nmDupRow");
	},
	isSameNumber : function(clist, info){
		var result = this.isDifferentAnsNumberInClist(clist);
		if(!result){ info.keycell.seterr(1);}
		return result;
	},

	checkSumOfNumberInLine : function(){
		this.checkRowsColsPartly(this.isTotalNumber, function(cell){ return cell.is51cell();}, "nmSumRowNe");
	},
	isTotalNumber : function(clist, info){
		var number = info.key51num, sum = 0;
		for(var i=0;i<clist.length;i++){
			if(clist[i].anum>0){ sum += clist[i].anum;}
			else{ return true;}
		}
		var result = (number<=0 || sum===number);
		if(!result){
			info.keycell.seterr(1);
			clist.seterr(1);
		}
		return result;
	}
},

FailCode:{
	nmSumRowNe : ["数字の下か右にある数字の合計が間違っています。","The sum of the cells is not correct."],
	ceNoNum    : ["すべてのマスに数字が入っていません。","There is an empty cell."]
}
});
