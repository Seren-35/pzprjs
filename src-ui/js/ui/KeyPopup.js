// KeyPopup.js v3.4.0
/* global createEL:readonly, getEL:readonly */

//---------------------------------------------------------------------------
// ★KeyPopupクラス マウスからキーボード入力する際のPopupウィンドウを管理する
//---------------------------------------------------------------------------
// キー入力用Popupウィンドウ
ui.keypopup = {
	/* メンバ変数 */
	paneltype: { 1: 0, 3: 0 } /* パネルのタイプ */,
	element: null /* キーポップアップのエレメント */,

	tdcolor: "black" /* 文字の色 */,
	imgCR: [1, 1] /* img表示用画像の横×縦のサイズ */,

	imgs: [] /* resize用 */,

	basepanel: null,
	clearflag: false,

	/* どの文字配置を作成するかのテーブル */
	type: {
		slither: [3, 0],
		nawabari: [4, 0],
		fourcells: [4, 0],
		fivecells: [4, 0],
		fillmat: [4, 0],
		paintarea: [4, 0],
		lightup: [4, 0],
		shakashaka: [4, 0],
		gokigen: [4, 0],
		wagiri: [4, 0],
		shugaku: [4, 0],
		creek: [4, 0],
		ichimaga: [4, 0],
		ichimagam: [4, 0],
		ichimagax: [4, 0],
		sukoro: [4, 4],
		sukororoom: [4, 4],
		lookair: [5, 0],
		hebi: [5, 5],
		tawa: [6, 0],
		hashikake: [8, 0],
		tapa: [8, 0],
		tapaloop: [8, 0],
		amibo: [10, 0],
		cave: [10, 0],
		bdblock: [10, 0],
		country: [10, 0],
		usotatami: [10, 0],
		heyawake: [10, 0],
		ayeheya: [10, 0],
		kurodoko: [10, 0],
		nagenawa: [10, 0],
		numlin: [10, 0],
		nurikabe: [10, 0],
		nuribou: [10, 0],
		norinuri: [10, 0],
		mochikoro: [10, 0],
		mochinyoro: [10, 0],
		shikaku: [10, 0],
		aho: [10, 0],
		shimaguni: [10, 0],
		chocona: [10, 0],
		yajitatami: [10, 0],
		tasquare: [10, 0],
		kurotto: [10, 0],
		bonsan: [10, 0],
		heyabon: [10, 0],
		rectslider: [10, 0],
		satogaeri: [10, 0],
		yosenabe: [10, 0],
		herugolf: [10, 0],
		firefly: [10, 0],
		tateyoko: [10, 0],
		factors: [10, 10],
		fillomino: [10, 10],
		symmarea: [10, 10],
		renban: [10, 10],
		ripple: [10, 10],
		cojun: [10, 10],
		makaro: [10, 10],
		sudoku: [10, 10],
		nanro: [10, 10],
		view: [10, 10],
		kakuru: [10, 10],
		kazunori: [10, 10],
		skyscrapers: [10, 10],
		kropki: [0, 10],
		tilepaint: [51, 0],
		triplace: [51, 0],
		kakuro: [51, 10],
		usoone: [4, 0],

		slalom: [101, 0],
		reflect: [102, 0],
		pipelink: [111, 0],
		pipelinkr: [111, 0],
		loopsp: [111, 0],
		tatamibari: [112, 0],
		hakoiri: [113, 113],
		kusabi: [114, 0],
		aqre: [10, 0],
		doppelblock: [10, 115],
		interbd: [116, 0],
		toichika2: [10, 10],
		crossstitch: [10, 0],
		ovotovata: [10, 0],
		lohkous: [10, 0],
		chainedb: [10, 0],
		canal: [10, 0],
		cbanana: [10, 0],
		bdwalk: [117, 0],
		voxas: [118, 0],
		oneroom: [10, 0],
		tontti: [10, 0],
		lapaz: [10, 0],
		tren: [10, 0],
		pentominous: [119, 119],
		hinge: [10, 0],
		tajmahal: [8, 0],
		railpool: [10, 0],
		coral: [10, 0],
		ququ: [10, 0],
		disloop: [10, 0],
		lither: [3, 0],
		snakepit: [120, 10],
		squarejam: [10, 0],
		context: [4, 0],
		numrope: [10, 10],
		yajisoko: [10, 0],
		roundtrip: [10, 0],
		cts: [121, 0],
		vslither: [4, 0],
		tslither: [4, 0],
		kaidan: [4, 0],
		anglers: [122, 0],
		heyablock: [10, 0],
		koburin: [4, 0],
		mirrorbk: [10, 0],
		takoyaki: [4, 0],
		lightshadow: [10, 0],
		familyphoto: [10, 0],
		icelom: [10, 0],
		icelom2: [10, 0],
		icewalk: [10, 0],
		ladders: [10, 0],
		akichi: [10, 0],
		slashpack: [10, 0],
		remlen: [10, 0],
		cocktail: [10, 0],
		news: [123, 123],
		dbchoco: [10, 0],
		nurimisaki: [10, 0],
		nonogram: [10, 0],
		box: [10, 0],
		aquarium: [10, 0],
		snake: [10, 0],
		tents: [10, 0],
		armyants: [10, 0],
		araf: [10, 0],
		bosanowa: [10, 10],
		meander: [10, 10],
		juosan: [10, 0],
		walllogic: [10, 0],
		mines: [8, 0],
		pencils: [10, 0],
		minarism: [10, 10],
		trainstations: [124, 0],
		wafusuma: [10, 0],
		kuroclone: [10, 0],
		martini: [10, 0],
		simplegako: [10, 10],
		tontonbeya: [113, 113],
		magnets: [125, 0],
		fracdiv: [51, 0],
		battleship: [126, 0],
		heyapin: [10, 0],
		detour: [10, 0],
		maxi: [10, 0],
		tetrochain: [10, 0],
		brownies: [127, 0],
		sashikazune: [10, 0],
		patchwork: [10, 0],
		waterwalk: [10, 0],
		haisu: [10, 0],
		wittgen: [4, 0],
		aquapelago: [10, 0],
		compass: [10, 0],
		mukkonn: [10, 0],
		tachibk: [10, 0],
		alter: [113, 113],
		mannequin: [10, 0],
		tetrominous: [128, 128],
		lineofsight: [10, 0],
		mrtile: [10, 0],
		genderwalk: ["gender", 0]
	},

	//---------------------------------------------------------------------------
	// kp.display()     キーポップアップを表示する
	//---------------------------------------------------------------------------
	display: function() {
		var mode = ui.puzzle.editmode ? 1 : 3;
		if (
			this.element &&
			!!this.paneltype[mode] &&
			ui.menuconfig.get("keypopup")
		) {
			this.element.style.display = "block";

			getEL("panelbase1").style.display = mode === 1 ? "block" : "none";
			getEL("panelbase3").style.display = mode === 3 ? "block" : "none";
		} else if (!!this.element) {
			this.element.style.display = "none";
		}
	},

	//---------------------------------------------------------------------------
	// kp.create()      キーポップアップを生成して初期化する
	// kp.createtable() キーポップアップのポップアップを作成する
	//---------------------------------------------------------------------------
	create: function() {
		if (!!this.element) {
			getEL("panelbase1").innerHTML = "";
			getEL("panelbase3").innerHTML = "";
		}

		this.imgs = []; // resize用

		var type = this.type[ui.puzzle.pid];
		if (!type) {
			type = [0, 0];
		}

		this.paneltype = { 1: !ui.puzzle.playeronly ? type[0] : 0, 3: type[1] };
		if (!this.paneltype[1] && !this.paneltype[3]) {
			return;
		}

		if (!this.element) {
			var rect = pzpr.util.getRect(getEL("divques"));
			this.element = getEL("keypopup");
			this.element.style.left = rect.left + 48 + "px";
			this.element.style.top = rect.top + 48 + "px";
			pzpr.util.unselectable(this.element);
		}

		if (this.paneltype[1] !== 0) {
			this.createtable(1);
		}
		if (this.paneltype[3] !== 0) {
			this.createtable(3);
		}

		this.resizepanel();

		var bar = getEL("barkeypopup");
		ui.event.addEvent(bar, "mousedown", ui.popupmgr, ui.popupmgr.titlebardown);
		ui.event.addEvent(bar, "dblclick", ui.menuconfig, function() {
			this.set("keypopup", false);
		});
	},
	createtable: function(mode, type) {
		this.basepanel = getEL("panelbase" + mode);
		this.basepanel.innerHTML = "";

		this.tdcolor = mode === 3 ? ui.puzzle.painter.fontAnscolor : "black";

		this.generate(mode);
	},

	//---------------------------------------------------------------------------
	// kp.generate()    キーポップアップのテーブルを作成する
	// kp.gentable4()   キーポップアップの0～4を入力できるテーブルを作成する
	// kp.gentable10()  キーポップアップの0～9を入力できるテーブルを作成する
	// kp.gentable51()  キーポップアップの[＼],0～9を入力できるテーブルを作成する
	//---------------------------------------------------------------------------
	generate: function(mode) {
		var type = this.paneltype[mode];
		if (type === 4) {
			this.gentable4(mode);
		} else if (type === 10) {
			this.gentable10(mode);
		} else if (type === 51) {
			this.gentable51(mode);
		} else if (type === 3) {
			this.gentable3(mode);
		} else if (type === 5) {
			this.gentable5(mode);
		} else if (type === 6) {
			this.gentable6(mode);
		} else if (type === 8) {
			this.gentable8(mode);
		} else if (type === 101) {
			this.generate_slalom(mode);
		} else if (type === 102) {
			this.generate_reflect(mode);
		} else if (type === 111) {
			this.generate_pipelink(mode);
		} else if (type === 112) {
			this.generate_tatamibari(mode);
		} else if (type === 113) {
			this.generate_hakoiri(mode);
		} else if (type === 114) {
			this.generate_kusabi(mode);
		} else if (type === 115) {
			this.generate_doppelblock();
		} else if (type === 116) {
			this.generate_interbd();
		} else if (type === 117) {
			this.generate_bdwalk();
		} else if (type === 118) {
			this.generate_voxas();
		} else if (type === 119) {
			this.generate_pentominous(mode);
		} else if (type === 120) {
			this.generate_snakepit(mode);
		} else if (type === 121) {
			this.generate_cts(mode);
		} else if (type === 122) {
			this.generate_anglers(mode);
		} else if (type === 123) {
			this.generate_news(mode);
		} else if (type === 124) {
			this.generate_trainstations(mode);
		} else if (type === 125) {
			this.generate_magnets(mode);
		} else if (type === 126) {
			this.generate_battleship(mode);
		} else if (type === 127) {
			this.generate_brownies(mode);
		} else if (type === 128) {
			this.generate_tetrominous(mode);
		} else if (type === "gender") {
			this.generate_genderwalk(mode);
		}
	},
	gentable4: function(mode) {
		var pid = ui.puzzle.pid,
			itemlist = ["1", "2", "3", "4"];
		if (mode === 3 && (pid === "sukoro" || pid === "sukororoom")) {
			var mbcolor = ui.puzzle.painter.mbcolor;
			itemlist.push(
				["q", { text: "○", color: mbcolor }],
				["w", { text: "×", color: mbcolor }],
				" ",
				null
			);
		} else {
			var cap = "?";
			if (ui.puzzle.painter.hideHatena) {
				switch (pid) {
					case "lightup":
					case "shakashaka":
						cap = "■";
						break;
					case "gokigen":
					case "wagiri":
					case "shugaku":
					case "creek":
						cap = "○";
						break;
				}
			}
			itemlist.push("0", null, " ", ["-", cap]);
		}
		this.generate_main(itemlist, 4);
	},
	gentable10: function(mode) {
		var pid = ui.puzzle.pid,
			itemlist = [];
		if (mode === 3 && ui.puzzle.klass.Cell.prototype.numberWithMB) {
			var mbcolor = ui.puzzle.painter.mbcolor;
			itemlist.push(
				["q", { text: "○", color: mbcolor }],
				["w", { text: "×", color: mbcolor }],
				" ",
				null
			);
		}
		if (
			mode === 1 &&
			(pid === "kakuru" ||
				pid === "tateyoko" ||
				pid === "crossstitch" ||
				pid === "numrope" ||
				pid === "yajisoko")
		) {
			itemlist.push(["q1", pid === "yajisoko" ? "□" : "■"]);
			if (pid === "crossstitch") {
				itemlist.push(["w2", "○"]);
			}
			itemlist.push(["-", "?"]);
		}

		itemlist.push("0", "1", "2", "3", "4", "5", "6", "7", "8", "9");
		if (mode === 3 && pid === "toichika2") {
			itemlist.push(["-", { text: "・", color: "rgb(255, 96, 191)" }]);
		}
		itemlist.push(
			mode === 1 || !ui.puzzle.klass.Cell.prototype.numberWithMB ? " " : null
		);

		var cap = null;
		if (
			mode === 3 ||
			pid === "kakuru" ||
			pid === "numrope" ||
			pid === "tateyoko" ||
			pid === "crossstitch" ||
			pid === "yajisoko"
		) {
		} else if (pid === "tasquare") {
			cap = "□";
		} else if (
			pid === "rectslider" ||
			pid === "aquapelago" ||
			pid === "mrtile"
		) {
			cap = "■";
		} else if (pid === "patchwork") {
			cap = {
				text: "■",
				color: "rgb(204,204,204)"
			};
		} else if (
			pid === "kurotto" ||
			pid === "bonsan" ||
			pid === "satogaeri" ||
			pid === "heyabon" ||
			pid === "yosenabe" ||
			pid === "herugolf" ||
			pid === "kazunori" ||
			pid === "nurimisaki" ||
			pid === "amibo" ||
			pid === "firefly" ||
			pid === "shikaku" ||
			pid === "aho" ||
			pid === "bosanowa" ||
			pid === "minarism"
		) {
			cap = "○";
		} else if (!ui.puzzle.painter.hideHatena) {
			cap = "?";
		}
		if (cap !== null) {
			itemlist.push(["-", cap]);
		}
		if (pid === "familyphoto") {
			itemlist.push(["q", "●"]);
		}
		if (
			pid === "icelom" ||
			pid === "icelom2" ||
			pid === "icewalk" ||
			pid === "waterwalk" ||
			pid === "dbchoco"
		) {
			itemlist.push([
				"q",
				{
					text: "■",
					color: pid === "dbchoco" ? "rgb(204,204,204)" : "rgb(192,224,255)"
				}
			]);
		}
		this.generate_main(itemlist, 4);
	},
	gentable51: function(mode) {
		this.generate_main(
			[
				["q", { image: 0 }],
				" ",
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8",
				"9",
				"0"
			],
			4
		);
	},

	//---------------------------------------------------------------------------
	// kp.gentable3()  キーポップアップの0～4を入力できるテーブルを作成する
	// kp.gentable5()  キーポップアップの0～5を入力できるテーブルを作成する
	// kp.gentable6()  キーポップアップの0～6を入力できるテーブルを作成する
	// kp.gentable8()  キーポップアップの0～8を入力できるテーブルを作成する
	//---------------------------------------------------------------------------
	gentable3: function(mode) {
		this.generate_main(["1", "2", "3", "0", " ", ["-", "?"]], 3);
	},
	gentable5: function(mode) {
		this.generate_main(
			[
				"1",
				"2",
				"3",
				"4",
				"5",
				null,
				"0",
				" ",
				[
					"-",
					{
						text: mode === 1 ? "?" : "・",
						color: mode === 3 ? "rgb(255, 96, 191)" : ""
					}
				]
			],
			3
		);
	},
	gentable6: function(mode) {
		this.generate_main(["1", "2", "3", "4", "5", "6", "0", " ", ["-", "?"]], 3);
	},
	gentable8: function(mode) {
		var pid = ui.puzzle.pid;
		if (pid === "brownies") {
			this.generate_main(
				["1", "2", "3", "4", "5", "6", "7", "8", " ", ["-", "?"], ["w", "○"]],
				4
			);
		} else if (pid !== "tapa" && pid !== "tapaloop" && pid !== "mines") {
			this.generate_main(
				["1", "2", "3", "4", "5", "6", "7", "8", " ", ["-", "○"]],
				4
			);
		} else {
			this.generate_main(
				["1", "2", "3", "4", "5", "6", "7", "8", "0", " ", ["-", "?"]],
				4
			);
		}
	},

	//---------------------------------------------------------------------------
	// kp.generate_slalom()     スラローム用のテーブルを作成する
	// kp.generate_reflect()    リフレクトリンク用のテーブルを作成する
	//---------------------------------------------------------------------------
	generate_slalom: function(mode) {
		this.imgCR = [4, 1];
		this.generate_main(
			[
				["q", { image: 0 }],
				["s", { image: 1 }],
				["w", { image: 2 }],
				["e", { image: 3 }],
				["r", " "],
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8",
				"9",
				"0",
				"-",
				" "
			],
			5
		);
	},
	generate_reflect: function(mode) {
		this.imgCR = [4, 1];
		this.generate_main(
			[
				["q", { image: 0 }],
				["w", { image: 1 }],
				["e", { image: 2 }],
				["r", { image: 3 }],
				["t", "╋"],
				["y", " "],
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8",
				"9",
				"0",
				"-"
			],
			6
		);
	},

	//---------------------------------------------------------------------------
	// kp.generate_pipelink()   パイプリンク、帰ってきたパイプリンク、環状線スペシャル用のテーブルを作成する
	// kp.generate_tatamibari() タタミバリ用のテーブルを作成する
	// kp.generate_hakoiri()    はこいり○△□用のテーブルを作成する
	// kp.generate_kusabi()     クサビリンク用のテーブルを作成する
	//---------------------------------------------------------------------------
	generate_pipelink: function(mode) {
		var pid = ui.puzzle.pid,
			itemlist = [];
		itemlist.push(
			["q", "╋"],
			["w", "┃"],
			["e", "━"],
			["r", " "],
			pid !== "loopsp" ? ["-", "?"] : null,
			["a", "┗"],
			["s", "┛"],
			["d", "┓"],
			["f", "┏"]
		);
		if (pid === "pipelink") {
			itemlist.push(null);
		} else if (pid === "pipelinkr") {
			itemlist.push(["1", "○"]);
		} else if (pid === "loopsp") {
			itemlist.push(["-", "○"]);
		}

		if (pid === "loopsp") {
			itemlist.push("1", "2", "3", "4", "5", "6", "7", "8", "9", "0");
		}
		this.generate_main(itemlist, 5);
	},
	generate_tatamibari: function(mode) {
		this.generate_main(
			[
				["q", "╋"],
				["w", "┃"],
				["e", "━"],
				["r", " "],
				["-", "?"]
			],
			3
		);
	},
	generate_hakoiri: function(mode) {
		var pid = ui.puzzle.pid,
			itemlist = [];

		itemlist.push(["1", "○"], ["2", "△"], ["3", "□"]);
		if (pid === "hakoiri" || pid === "alter") {
			itemlist.push([
				"4",
				{
					text: mode === 1 ? "?" : "・",
					color: mode === 3 ? "rgb(255, 96, 191)" : ""
				}
			]);
		}
		itemlist.push(" ");
		this.generate_main(itemlist, 3);
	},
	generate_kusabi: function(mode) {
		this.generate_main(
			[["1", "同"], ["2", "短"], ["3", "長"], ["-", "○"], " "],
			3
		);
	},
	generate_doppelblock: function() {
		this.generate_main(
			[
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8",
				"9",
				"0",
				["q", "⋅"],
				["w", "■"],
				" "
			],
			5
		);
	},
	generate_interbd: function() {
		this.generate_main(
			[
				"1",
				"2",
				"3",
				"4",
				"0",
				["-", { text: "?", color: "gray" }],
				["q", { text: "●", color: "red" }],
				["w", { text: "◆", color: "blue" }],
				["e", { text: "▲", color: "green" }],
				["r", { text: "■", color: "#c000c0" }],
				["t", { text: "⬟", color: "#ff8000" }],
				["y", { text: "⬣", color: "#00c0c0" }],
				" "
			],
			4
		);
	},
	generate_bdwalk: function() {
		this.generate_main(
			[
				["-", { text: "■", color: "gray" }],
				["u", { text: "▲" }],
				["d", { text: "▼" }],
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8",
				"9",
				"0",
				" "
			],
			4
		);
	},
	generate_voxas: function() {
		this.generate_main(
			[
				["2", { text: "●" }],
				["3", { text: "●", color: "gray" }],
				["4", { text: "○" }],
				["1", { text: "━" }],
				" "
			],
			3
		);
	},
	generate_pentominous: function(mode) {
		var items = "filnptuvwxyz".split("").map(function(c) {
			return [c, { text: c.toUpperCase() }];
		});
		if (mode === 1) {
			items.push(["-", "?"], ["q", "■"]);
		}
		items.push(" ");

		this.generate_main(items, 5);
	},
	generate_tetrominous: function(mode) {
		var items = "ilost".split("").map(function(c) {
			return [c, { text: c.toUpperCase() }];
		});
		if (mode === 1) {
			items.push(["-", "?"], ["q", "■"]);
		}
		items.push(" ");

		this.generate_main(items, 4);
	},
	generate_snakepit: function() {
		this.generate_main(
			[
				"0",
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8",
				"9",
				" ",
				["-", "?"],
				["q", { text: "○" }],
				["w", { text: "■", color: "gray" }]
			],
			4
		);
	},
	generate_cts: function() {
		this.generate_main(
			[
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8",
				"9",
				"0",
				["-", "?"],
				["w", "*"],
				" "
			],
			5
		);
	},
	generate_anglers: function() {
		this.imgCR = [2, 1];
		this.generate_main(
			[
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8",
				"9",
				"0",
				["-", "?"],
				["q", { image: 0 }],
				["w", { image: 1 }],
				" "
			],
			5
		);
	},
	generate_news: function(mode) {
		var mbcolor = ui.puzzle.painter.mbcolor;
		this.generate_main(
			[
				mode === 3 ? ["z", { text: "○", color: mbcolor }] : " ",
				["n", "N"],
				" ",
				["w", "W"],
				["x", mode === 3 ? { text: "⋅", color: mbcolor } : "×"],
				["e", "E"],
				" ",
				["s", "S"],
				" "
			],
			3
		);
	},

	generate_trainstations: function(mode) {
		this.generate_main(
			[
				"0",
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8",
				"9",
				" ",
				["-", "?"],
				["q", "╋"]
			],
			4
		);
	},

	generate_magnets: function(mode) {
		this.generate_main(
			[
				"0",
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8",
				"9",
				" ",
				["q", { text: "■", color: "gray" }],
				["1", "╋"],
				["2", "━"]
			],
			4
		);
	},

	generate_battleship: function(mode) {
		this.imgCR = [10, 1];
		this.generate_main(
			[
				["7", { image: 6 }],
				["8", { image: 7 }],
				["1", { image: 4 }],
				"1",
				"2",
				"3",
				["9", { image: 8 }],
				["a", { image: 9 }],
				["2", { image: 5 }],
				"4",
				"5",
				"6",
				["3", { image: 2 }],
				["5", { image: 0 }],
				["4", { image: 3 }],
				"7",
				"8",
				"9",
				["6", { image: 1 }],
				["0", { text: "~", color: "blue" }],
				["-", "?"],
				" ",
				"0"
			],
			6
		);
	},

	generate_brownies: function(mode) {
		this.generate_main(
			[
				"0",
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8",
				" ",
				["q", "○"],
				["w", "■"]
			],
			4
		);
	},

	generate_genderwalk: function() {
		this.imgCR = [4, 4];
		this.generate_main(
			[
				["a", { image: 0 }],
				["b", { image: 1 }],
				["c", { image: 2 }],
				["d", { image: 3 }],
				["e", { image: 4 }],
				["f", { image: 5 }],
				["g", { image: 6 }],
				["h", { image: 7 }],
				["i", { image: 8 }],
				["j", { image: 9 }],
				["k", { image: 10 }],
				["l", { image: 11 }],
				["m", { image: 12 }],
				["n", { image: 13 }],
				["o", { image: 14 }],
				["p", { image: 15 }],
				" ",
				["-", "?"],
				["q", { text: "■", color: "rgb(255, 179, 255)" }]
			],
			4
		);
	},

	generate_main: function(list, split) {
		for (var i = 0; i < list.length; i++) {
			this.inputcol(list[i]);
			if ((i + 1) % split === 0) {
				this.insertrow();
			}
		}
		if (i % split !== 0) {
			this.insertrow();
		}
	},

	//---------------------------------------------------------------------------
	// kp.inputcol()  テーブルのセルを追加する
	// kp.insertrow() テーブルの行を追加する
	//---------------------------------------------------------------------------
	inputcol: function(item) {
		var type = "num",
			ca,
			disp,
			color = this.tdcolor;
		if (!item) {
			type = "empty";
		} else {
			if (typeof item === "string") {
				ca = disp = item;
			} else if (typeof item[1] === "string") {
				ca = item[0];
				disp = item[1];
			} else if (!!item[1].text) {
				ca = item[0];
				disp = item[1].text;
				color = item[1].color;
			} else if (item[1].image !== void 0) {
				ca = item[0];
				disp = item[1].image;
				type = "image";
			}
		}

		var _div = null,
			_child = null;
		if (type !== "empty") {
			_div = createEL("div");
			_div.className = "kpcell kpcellvalid";
			_div.onclick = function(e) {
				e.preventDefault();
			};
			ui.event.addEvent(_div, "mousedown", ui.puzzle, function(e) {
				this.key.keyevent(ca, 0);
				e.preventDefault();
				e.stopPropagation();
			});
			pzpr.util.unselectable(_div);
		} else {
			_div = createEL("div");
			_div.className = "kpcell kpcellempty";
			pzpr.util.unselectable(_div);
		}

		if (type === "num") {
			_child = createEL("span");
			_child.className = "kpnum";
			_child.style.color = color;
			_child.innerHTML = disp;
			pzpr.util.unselectable(_child);
		} else if (type === "image") {
			_child = createEL("img");
			_child.className = "kpimg";
			var pid = ui.puzzle.pid;
			_child.src =
				"data:image/gif;base64," +
				this.dataurl[!!this.dataurl[pid] ? pid : "shitappa"];
			pzpr.util.unselectable(_child);
			var x = disp % this.imgCR[0],
				y = (disp - x) / this.imgCR[1];
			this.imgs.push({ el: _child, x: x, y: y });
		}

		if (this.clearflag) {
			_div.style.clear = "both";
			this.clearflag = false;
		}
		if (!!_child) {
			_div.appendChild(_child);
		}
		this.basepanel.appendChild(_div);
	},
	insertrow: function() {
		this.clearflag = true;
	},

	//---------------------------------------------------------------------------
	// kp.resizepanel() キーポップアップのセルのサイズを変更する
	//---------------------------------------------------------------------------
	resizepanel: function() {
		var cellsize = Math.min(ui.puzzle.painter.cw, 120);
		if (cellsize < 20) {
			cellsize = 20;
		}

		var dsize = (cellsize * 0.9) | 0,
			tsize = (cellsize * 0.7) | 0;
		for (var i = 0, len = this.imgs.length; i < len; i++) {
			var obj = this.imgs[i],
				img = obj.el;
			img.style.width = "" + dsize * this.imgCR[0] + "px";
			img.style.height = "" + dsize * this.imgCR[1] + "px";
			img.style.clip =
				"rect(" +
				(dsize * obj.y + 1) +
				"px," +
				dsize * (obj.x + 1) +
				"px," +
				dsize * (obj.y + 1) +
				"px," +
				(dsize * obj.x + 1) +
				"px)";
			img.style.top = "-" + obj.y * dsize + "px";
			img.style.left = "-" + obj.x * dsize + "px";
		}

		ui.misc.modifyCSS({
			"div.kpcell": {
				width: "" + dsize + "px",
				height: "" + dsize + "px",
				lineHeight: "" + dsize + "px"
			},
			"span.kpnum": { fontSize: "" + tsize + "px" }
		});
	},

	dataurl: {
		slalom:
			"R0lGODlhAAFAAMIEAAICAmBgYJ+fn///////AP//AP//AP//ACH5BAEKAAQALAAAAAAAAUAAAAP+OLrc/jDKSau9OOvNu/9gKI5kaZ5oqq5s675wLM90bd94ru+24AdAH68BKBqHNqNyyWw6n9DSD2oMCHhMZI3K7XqLI0Hgq7TmstoZec0GhMTt8jW5TKvj+OhnnFfOaWh2MH2EdR0ChUtmd0qCMYmJHXxOQFZ/P5OUjEeOL5CFHJmKfxFTmp2oIZ+EG6JVpBVwTQGptR2rfRquAIsbiLO2wRi4eRm7tB+yS7DCzQ7EeBi/yyO7zCiBziTQcRfTfiWuyCzZ2iLcbReu1yDrLeXmIOhsFt9F7CGu74bx5/NkFkSNO2EPAL4R8Prd+vclFpODbxKWkKhQA8OGFAS2EAX+UR6/ih4ueqFQsGPEMiCDieySUZGLkilrreTSEpwLjjFTzaRCweULewNz2tmpR4JPTyhTUBQ6geiTCUBjiFKxlGkEp06gUoMxVelHqxawNpmAE4Y9kxyqevw4dkFbt+XeQhBbtezPrSfUfpDLN67fr8/oNpLQ1SxeE3pDZuv7Ve4Ax4EFgyF8uMVZr4MxZ368+O9mzoCJSJ5cqjILeyAZb3bMuupo0hAucw3tTDUnBa0bu36tNemLwmCRvHbT1Lflo8GHDO9JG0XU5MJ5kzWdwm7e5tBFjyaJXAVMzbCzX5Ve3OaK5+CJizdKnrLx9GgXfl4fWbJD6iQ0rkgMfXmvBX0pfEcVdvT5x113+SF43Xz0MWBgTeYliF+DgLTH3IShMBEUhTc8eCCGxjQRH4fkWAjhe744MSKJ+5l4YoQhisjiDh4GRMmKBRmx4lq3zQiafa08YQlUu+goA3/J1agOFUH44CQQXOyoCoHrKelNkXj08giV4lkpTSJaHslldl5Kg2UXYW4SHotlapAjk1Iu2KOPVplCyZB05pmDk0Lo6eefgAYq6KCEFmrooSwkAAA7",
		anglers:
			"R0lGODdhgABAAPQAAP///wICAp+fn4CAgLCwsMDAwD8/PwAAABAQEFBQUKCgoO/v7yAgIDAwMJCQkN/f329vb39/fx8fH8/Pzy8vL6+vr7+/vw8PD2BgYF9fX0BAQE9PT4+PjwAAAAAAAAAAACwAAAAAgABAAAAF/yAgjmRpnmiqrmzrvnAsz3Rt33iu73zv/8CgcEgsGoOBpHLJbDqfUOexGK1ar80pEcvtSrVCr9gLDo/P1plgQCgUyim0HDozHO74hGIBH83/TDFrDHiFdw0OD3CAjAExEIaReAN8Wo2Aj3gSBnaSd5RTl3+ZnyMTERSSDBVHonMxFnknAhKRoFuuaLCyKBEXhhiVZrlju3grvoUNwkDEZzK1d6wqE7+aE8POXTKQdxktqZrMPdpiMhXiLRnKSOXb0HjY6oXBP+7vMRu84IUC9vdY1BSy8CLcHXk8AAass49FtYY6FF6hESvei4oHyUmsUqPTAQbjVHjUoHEjHRoP2O+5wHjA3w6TUWx08/Zi3aGEMJ/cMNjSRUqLEXN+sRFNmgt9pYIKDXTj4aQWAiDaWJoFBzp6DguFpEGVqVVDy1YYdImj65IdTp+mSHYgglKzPB7wTGoCo4G3XX0gVTYAoQi7eKn+iKoKQxsATsOWNZskCFtPYDVInizZLwvGjYXMhMz5AMEXmB0REWCzs6TPLkJPsQCBk2mgqTH3ATDQgu3btrfGkd1Haw7VvY/95r1I+GLGs30fhxv8TuClyY3fAF7c+XDkzQ88Fzo7gne315nPxol9/Evi5sPnTb89J/v38OPLn0+/vv37+PPr3z8+BAA7",
		battleship:
			"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",
		reflect:
			"R0lGODlhAAFAAIABAAAAAP///yH5BAEKAAEALAAAAAAAAUAAAAL+jI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6bgD8H/A9AMSi8YhMKpdJCPMJjSKdQiCOGJFqt9Mh96vNYq22ogSMflLT7OPZTJ4ZJ+362GGv0+dxmHufh7YW+EXR1cdy+EbINcgoVdGEqCJp+BjmdRlloTSJ0smpCeUoWmlp6hmyhFHKRNoKFwqaCuLKCqvIgJt7OkvLoZaxy4c3fHcx+ruRLGz8WrrMrCxrq+GciQu8OR25HZ2N3dqByS3m/S0eLuqxVf7si76ufvnR6K7bXp9eDK2ff4+gUK1+/DSpEggwCEJ/9OYFEiEIYMSDDQsyGpHmXkb+jBUbGOQ4URmbEh3xXSTRZlpKkict2jGhh1ZMlg8dbqQ50tPLE4Tegfm0s0+eFDVd3oQ5NE5RnkE9NkWaFEhPSjOdriQ6lUdLrDmN2qOaNcejFlethuQatsxYskdN/mS7Vm3cRGcXtAU7V4Y8F3UV9EWb9wVBvgvdkiO8V/BgxIcNn2P8EXJJycG8rtILi3JgzfDsNlacecWuGp/9QqIxDO8+OY89S8M8mmls0q9dV0N9DWVu2rcd84KdGmTwG5XNosJtrArD4cQvW1YuN/nA5NCj/7G8g3qseLuvHDf9m7d2bdqrN79u/JjY8uq7sZeK3jF89ubNvZ/fHnx+7/Q96z9nrtV2bpHRn4A2SUfgfgEpyF+BiziolH8HMNgghP8hqJQTCW3IYYcefghiiCKOSGKJJp6IYooqrlhOAQA7",
		shitappa:
			"R0lGODlhQABAAIABAAAAAP//ACH5BAEKAAEALAAAAABAAEAAAAL6jI+py+0Po5y02ouz3rz7DwHiSJbmiaZnqLbuW7LwTMdPjdcyCUb8veo5fkOUsEFEjgK2YyLJ+DWdBuiCOHVaFcmscPtcIrwg8Fh8Rn/VUXbVvIG/RW13R860z+k9PJys4ad3AIghyFc0aHEI4IMnwQj5uEMpqWjZCIToeFmZmDlRyAmqtIlJWhG5OMnVyRrWeeUaW2c66nkhKmvbykuhC4u6K7xKm+ebRlyMHIwb+Kh6F12qbCg3La2InY28za3s/T3sXGYV7pF1jt41y7yOpv5hEy/PQ18f9Ek1fF8OnAPwxY6ABP8VPMgIYcF9DBs6fAgxosSJFBMUAAA7",
		genderwalk:
			"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"
	}
};
