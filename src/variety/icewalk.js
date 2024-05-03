(function(pidlist, classbase) {
	if (typeof module === "object" && module.exports) {
		module.exports = [pidlist, classbase];
	} else {
		pzpr.classmgr.makeCustom(pidlist, classbase);
	}
})(["icewalk", "waterwalk", "genderwalk"], {
	MouseEvent: {
		inputModes: {
			edit: ["ice", "number", "clear", "info-line"],
			play: ["line", "peke", "info-line"]
		},
		mouseinput_auto: function() {
			if (this.puzzle.playmode) {
				if (this.btn === "left") {
					if (this.mousestart || this.mousemove) {
						this.inputLine();
					} else if (this.mouseend && this.notInputted()) {
						this.prevPos.reset();
						this.inputpeke();
					}
				} else if (
					this.btn === "right" &&
					(this.mousestart || this.mousemove)
				) {
					this.inputpeke();
				}
			} else if (this.puzzle.editmode) {
				var cell = this.getcell();
				if (
					this.btn === "right" &&
					!cell.isNum() &&
					(this.mousestart || this.mousemove)
				) {
					this.inputIcebarn();
				} else if (this.mouseend && this.notInputted()) {
					this.inputqnum();
				}
			}
		}
	},
	"MouseEvent@waterwalk": {
		inputModes: {
			edit: ["water", "number", "clear", "info-line"],
			play: ["line", "peke", "info-line"]
		},
		mouseinput_other: function() {
			if (this.inputMode === "water") {
				this.inputIcebarn();
			}
		}
	},
	"MouseEvent@genderwalk": {
		inputModes: {
			edit: ["water", "symbol", "symbol-", "clear", "info-line"],
			play: ["line", "peke", "info-line"]
		},
		mouseinput_other: function() {
			if (this.inputMode === "water") {
				this.inputIcebarn();
			} else if (this.inputMode === "symbol" || this.inputMode === "symbol-") {
				this.inputqnum();
			}
		}
	},
	KeyEvent: {
		enablemake: true,

		keyinput: function(ca) {
			if (ca === "q") {
				var cell = this.cursor.getc();
				cell.setQues(cell.ques !== 6 ? 6 : 0);
				this.prev = cell;
				cell.draw();
			} else {
				this.key_inputqnum(ca);
			}
		}
	},
	Border: {
		enableLineNG: true,
		isLineNG: function() {
			return !this.inside;
		},
		posthook: {
			line: function() {
				this.board.roommgr.isStale = true;
			}
		}
	},
	Cell: {
		posthook: {
			qnum: function(val) {
				if (val !== -1 && this.ques === 6) {
					this.setQues(0);
				} else if (this.pid === "genderwalk") {
					this.board.roommgr.isStale = true;
				}
			},
			ques: function(val) {
				this.board.roommgr.isStale = true;
				if (val === 6 && this.qnum !== -1) {
					this.setQnum(-1);
				}
			}
		},
		maxnum: function() {
			return this.board.cols * this.board.rows;
		},
		ice: function() {
			return this.isnull || this.ques === 6;
		}
	},
	"Cell@genderwalk": {
		maxnum: 16,
		numberAsLetter: true
	},
	Cross: {
		l2cnt: 0
	},
	Board: {
		hasborder: 2
	},
	Graphic: {
		irowake: true,
		bgcellcolor_func: "icebarn",
		paint: function() {
			this.drawBGCells();
			this.drawDashedGrid(false);

			this.drawBorders();

			this.drawLines();
			this.drawPekes();
			this.drawQuesNumbers();

			this.drawTarget();
		},
		getBorderColor: function(border) {
			var cell1 = border.sidecell[0],
				cell2 = border.sidecell[1];
			if (cell1.ice() ^ cell2.ice()) {
				return this.quescolor;
			}
			return null;
		}
	},
	"Graphic@waterwalk": {
		icecolor: "rgb(163, 216, 255)"
	},
	"Graphic@genderwalk": {
		icecolor: "rgb(255, 179, 255)",
		paint: function() {
			this.drawBGCells();
			this.drawDashedGrid(false);

			this.drawBorders();

			this.drawQuesShapes();
			this.drawHatenas();

			this.drawLines();
			this.drawPekes();

			this.drawTarget();
		},
		drawQuesShapes: function() {
			var shapes = [
				"M 0 -0.905 L 0.276 -0.285 L 0.951 -0.214 L 0.447 0.24 L 0.588 0.904 L 0 0.565 L -0.588 0.904 L -0.447 0.24 L -0.951 -0.214 L -0.276 -0.285 Z",
				"M 0 -0.823 L -0.95 0.823 L 0.95 0.823 Z",
				"M 0 -0.617 C 0.142 -1.092 0.95 -1.092 0.95 -0.475 C 0.95 0.048 0.19 0.427 0 0.902 C -0.19 0.427 -0.95 0.048 -0.95 -0.475 C -0.95 -1.092 -0.142 -1.092 0 -0.617 Z",
				"M 0 -1 L -1 0 L 0 1 L 1 0 Z",
				"M 0.033 0.943 A 0.4 0.4 0 1 0 -0.323 0.503 Q -0.335 0.622 -0.712 0.38 Q -0.445 0.892 0.033 0.943 Z M -0.876 -0.518 A 0.4 0.4 0 1 0 -0.317 -0.606 Q -0.414 -0.676 -0.017 -0.882 Q -0.593 -0.906 -0.876 -0.518 Z M 0.844 -0.575 A 0.4 0.4 0 1 0 0.64 -0.047 Q 0.75 -0.096 0.729 0.351 Q 1.038 -0.136 0.844 -0.575 Z",
				"M -0.85 0.9 C -1.1 -0.5 0.5 -0.5 0.85 -0.9 C 1.1 0.5 -0.5 0.5 -0.85 0.9 Z",
				"M 0.909 0.588 A 1 1 0 1 1 0.909 -0.588 A 0.7 0.7 0 1 0 0.909 0.588 Z",
				"M -1 -0.25 A 1 0.3 0 0 0 -0.309 0.035 A 0.5 0.5 0 1 0 0.309 0.035 A 1 0.3 0 0 0 1 -0.25 L 1 -0.95 A 1 0.3 0 0 1 -1 -0.95 Z",
				"M 0 -0.95 A 1 1 0 0 1 -0.9 -0.65 A 1.7 1.7 0 0 0 0 1 A 1.7 1.7 0 0 0 0.9 -0.65 A 1 1 0 0 1 0 -0.95 Z",
				"M 0.488 -0.839 A 0.917 0.917 0 0 0 -0.439 -0.791 A 0.75 0.75 0 0 0 -0.763 -0.1 A 0.583 0.583 0 0 0 -0.394 0.375 A 0.417 0.417 0 0 0 0.036 0.275 A 0.25 0.25 0 0 0 0.066 -0.013 A 0.1 0.1 0 0 0 -0.1 -0.03 A 0.1 0.1 0 0 1 -0.266 -0.047 A 0.25 0.25 0 0 1 -0.236 -0.335 A 0.417 0.417 0 0 1 0.194 -0.435 A 0.583 0.583 0 0 1 0.563 0.04 A 0.75 0.75 0 0 1 0.239 0.731 A 0.917 0.917 0 0 1 -0.688 0.779 A 1 1 0 0 0 0.488 -0.839 Z",
				"M 0.2 0.346 C 0.6 1.15 0.1 0.9 0 0.9 C -0.1 0.9 -0.6 1.15 -0.2 0.346 C -0.696 1.095 -0.729 0.537 -0.779 0.45 C -0.829 0.363 -1.296 0.055 -0.4 0 C -1.296 -0.055 -0.829 -0.363 -0.779 -0.45 C -0.729 -0.537 -0.696 -1.095 -0.2 -0.346 C -0.6 -1.15 -0.1 -0.9 -0 -0.9 C 0.1 -0.9 0.6 -1.15 0.2 -0.346 C 0.696 -1.095 0.729 -0.537 0.779 -0.45 C 0.829 -0.363 1.296 -0.055 0.4 -0 C 1.296 0.055 0.829 0.363 0.779 0.45 C 0.729 0.537 0.696 1.095 0.2 0.346 Z",
				"M 0.14 -0.14 A 0.331 0.331 0 0 1 0.33 0.189 L 0.503 0.289 A 0.331 0.331 0 1 1 0.363 0.531 L 0.19 0.431 A 0.331 0.331 0 0 1 -0.19 0.431 L -0.363 0.531 A 0.331 0.331 0 1 1 -0.503 0.289 L -0.33 0.189 A 0.331 0.331 0 0 1 -0.14 -0.14 L -0.14 -0.34 A 0.331 0.331 0 1 1 0.14 -0.34 Z",
				"M 0 1.05 L 0.735 0.42 L 0.21 -0.578 L 0.42 -0.788 L 0.315 -0.997 L -0.315 -0.997 L -0.42 -0.788 L -0.21 -0.578 L -0.735 0.42 Z",
				"M 0.105 -0.42 C 0.315 -0.735 0.84 -0.945 0.945 -0.84 C 1.05 -0.735 0.945 0 0.63 0.105 C 1.155 0.63 0.525 1.155 0.105 0.63 A 0.15 0.7 0 0 1 -0.105 0.63 C -0.525 1.155 -1.155 0.63 -0.63 0.105 C -0.945 0 -1.05 -0.735 -0.945 -0.84 C -0.84 -0.945 -0.315 -0.735 -0.105 -0.42 A 0.15 0.7 0 0 1 0.105 -0.42 Z",
				"M 0.9 -0.75 L 0.9 0.75 L 0.525 0.375 L 0.525 -0.375 Z M 0.75 0.9 L -0.75 0.9 L -0.375 0.525 L 0.375 0.525 Z M -0.9 0.75 L -0.9 -0.75 L -0.525 -0.375 L -0.525 0.375 Z M -0.75 -0.9 L 0.75 -0.9 L 0.375 -0.525 L -0.375 -0.525 Z M 0.3 -0.3 L 0.3 0.3 L -0.3 0.3 L -0.3 -0.3 Z",
				"M -0.41 0.141 A 0.2 0.2 0 1 1 -0.41 -0.141 L -0.141 -0.41 A 0.58 0.58 0 1 0 -0.141 0.41 L 0.41 -0.141 A 0.2 0.2 0 1 1 0.41 0.141 L 0.141 0.41 A 0.58 0.58 0 1 0 0.141 -0.41 Z"
			];

			var g = this.vinc("cell_shape", "auto");

			g.lineWidth = Math.max(this.cw / 25, 1);
			var rsize = this.cw * 0.35;

			var clist = this.range.cells;
			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i];
				g.vid = "c_mk_" + cell.id;
				g.strokeStyle = this.quescolor;
				var px = cell.bx * this.bw;
				var py = cell.by * this.bh;
				if (cell.qnum > 0 && cell.qnum <= shapes.length) {
					g.beginPath();
					this.drawPath(g, shapes[cell.qnum - 1], px, py, rsize);
					g.stroke();
				} else {
					g.vhide();
				}
			}
		},
		drawPath: function(g, path, px, py, rsize) {
			var ctx = g.context || g;
			var movx = 0;
			var movy = 0;
			var curx = 0;
			var cury = 0;
			var arc = function(rx, ry, phi, large, sweep, x, y) {
				var sinPhi = Math.sin(phi);
				var cosPhi = Math.cos(phi);
				var dx = 0.5 * (curx - x);
				var dy = 0.5 * (cury - y);
				var xp = cosPhi * dx + sinPhi * dy;
				var yp = cosPhi * dy - sinPhi * dx;
				var rxyp = rx * yp;
				var ryxp = ry * xp;
				var denom = rxyp * rxyp + ryxp * ryxp;
				var c = Math.sqrt(Math.abs((rx * rx * ry * ry) / denom - 1));
				if (!large === !sweep) {
					c = -c;
				}
				var cxp = (c * rxyp) / ry;
				var cyp = (-c * ryxp) / rx;
				var cx = cosPhi * cxp - sinPhi * cyp + 0.5 * (curx + x);
				var cy = sinPhi * cxp + cosPhi * cyp + 0.5 * (cury + y);
				var getAngle = function(x, y) {
					var r = Math.acos(x / Math.hypot(x, y));
					return y < 0 ? -r : r;
				};
				var theta0 = getAngle((xp - cxp) / rx, (yp - cyp) / ry);
				var theta1 = getAngle(-(xp + cxp) / rx, -(yp + cyp) / ry);
				this.ellipse(cx, cy, rx, ry, phi, theta0, theta1, !sweep);
			};
			var commands = {
				A: {
					f: ctx.ellipse ? arc : null,
					args: ["r", "r", "0", "0", "0", "x", "y"]
				},
				C: { f: ctx.bezierCurveTo, args: ["x", "y", "x", "y", "x", "y"] },
				L: { f: ctx.lineTo, args: ["x", "y"] },
				M: { f: ctx.moveTo, args: ["x", "y"] },
				Q: { f: ctx.quadraticCurveTo, args: ["x", "y", "x", "y"] },
				Z: { f: ctx.closePath, args: [] }
			};
			var tokens = path.split(" ");
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				var cmd = commands[token];
				var args = [];
				for (var j = 0; j < cmd.args.length; j++) {
					i++;
					var value = +tokens[i];
					var argType = cmd.args[j];
					if (argType !== "0") {
						value *= rsize;
						if (argType === "x") {
							value += px;
						} else if (argType === "y") {
							value += py;
						}
					}
					args.push(value);
				}
				if (cmd.f) {
					cmd.f.apply(ctx, args);
				} else if (g.cpath) {
					g.lastpath = token;
					g.cpath.push(token);
					g.cpath = g.cpath.concat(args);
				}
				if (args.length >= 2) {
					curx = args[args.length - 2];
					cury = args[args.length - 1];
				} else if (token === "Z") {
					curx = movx;
					cury = movy;
				}
				if (token === "M") {
					movx = curx;
					movy = cury;
				}
			}
		}
	},
	LineGraph: {
		enabled: true
	},
	"LineGraph@icewalk": {
		isLineCross: true
	},
	AreaRoomGraph: {
		countprop: "l2cnt",
		enabled: true,
		relation: {
			"cell.ques": "node",
			"border.line": "separator"
		},
		isedgevalidbylinkobj: function(border) {
			if (!border.isLine()) {
				return false;
			}
			return border.sidecell[0].ice() === border.sidecell[1].ice();
		}
	},
	"AreaRoomGraph@genderwalk": {
		setExtraData: function(component) {
			this.common.setExtraData.call(this, component);
			component.determineMarkType();
		}
	},
	"GraphComponent@genderwalk": {
		determineMarkType: function() {
			this.markType = -1;
			var clist = this.clist;
			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i];
				if (cell.qnum === -2 && this.markType === -1) {
					this.markType = -2;
				} else if (cell.qnum >= 0) {
					if (this.markType === -2 || this.markType === -1) {
						this.markType = cell.qnum;
					} else if (cell.qnum !== this.markType) {
						this.markType = -3;
					}
				}
			}
		}
	},
	Encode: {
		decodePzpr: function() {
			this.decodeIce();
			this.decodeNumber16();
		},
		encodePzpr: function() {
			this.encodeIce();
			this.encodeNumber16();
		}
	},
	FileIO: {
		decodeData: function() {
			this.decodeCell(function(cell, ca) {
				if (ca === "#") {
					cell.ques = 6;
				} else if (ca === "-") {
					cell.qnum = -2;
				} else if (ca !== ".") {
					cell.qnum = +ca;
				}
			});
			this.decodeBorderLine();
		},
		encodeData: function() {
			this.encodeCell(function(cell) {
				if (cell.ques === 6) {
					return "# ";
				} else if (cell.qnum === -2) {
					return "- ";
				} else if (cell.qnum >= 0) {
					return cell.qnum + " ";
				} else {
					return ". ";
				}
			});
			this.encodeBorderLine();
		}
	},
	AnsCheck: {
		checklist: [
			"checkBranchLine",
			"checkCrossLine@waterwalk,genderwalk",
			"checkCrossOutOfIce@icewalk",
			"checkIceLines@icewalk",
			"checkWaterWalk@waterwalk,genderwalk",
			"checkLessWalk@icewalk,waterwalk",
			"checkOverWalk@icewalk,waterwalk",

			"checkPassesSingleMarks@genderwalk",
			"checkPassesAnyMarks@genderwalk",
			"checkConsecutiveMarks@genderwalk",

			"checkOneLoop",
			"checkNoLineOnNum",
			"checkDeadendLine+"
		],

		checkLessWalk: function() {
			this.checkWalkLength(-1, "bkSizeLt");
		},
		checkOverWalk: function() {
			this.checkWalkLength(+1, "bkSizeGt");
		},
		checkWaterWalk: function() {
			this.checkWalkLength(+2, "bkSizeGt2");
		},

		checkWalkLength: function(flag, code) {
			if (this.board.roommgr.isStale) {
				// TODO The room manager will break in certain conditions.
				// It is rebuilt here as a workaround.
				this.board.roommgr.isStale = false;
				this.board.roommgr.rebuild();
			}
			for (var i = 0; i < this.board.cell.length; i++) {
				var cell = this.board.cell[i];
				var qnum = cell.qnum;
				if (flag === +2) {
					if (!cell.ice()) {
						continue;
					}
					qnum = 2;
				}
				if (qnum <= 0 || !cell.room) {
					continue;
				}

				if (
					flag < 0 &&
					cell.room.clist.some(function(c) {
						return c.lcnt !== 2;
					})
				) {
					continue;
				}

				var d = cell.room.clist.length;

				if (flag > 0 ? d > qnum : d < qnum) {
					this.failcode.add(code);
					if (this.checkOnly) {
						return;
					}
					cell.room.clist.seterr(1);
				}
			}
		},

		checkPassesSingleMarks: function() {
			this.checkAllRoom(
				-3,
				function(cell) {
					return cell.qnum >= 0 && cell.lcnt > 0;
				},
				"bkDifferentMarksPassed"
			);
		},
		checkPassesAnyMarks: function() {
			this.checkAllRoom(
				-1,
				function(cell) {
					return true;
				},
				"bkNoMarksPassed"
			);
		},

		checkAllRoom: function(cond, errfilter, code) {
			var rooms = this.board.roommgr.components;
			for (var id = 0; id < rooms.length; id++) {
				var room = rooms[id];
				var ignore = room.clist.some(function(c) {
					return c.lcnt !== 2 || c.ice();
				});
				if (ignore || room.markType !== cond) {
					continue;
				}
				this.failcode.add(code);
				if (this.checkOnly) {
					break;
				}
				room.clist.filter(errfilter).seterr(1);
			}
		},

		checkConsecutiveMarks: function() {
			var neighbors = [];
			var borders = this.board.border;
			for (var id = 0; id < borders.length; id++) {
				var border = borders[id];
				if (border.line === 0) {
					continue;
				}
				var iceInRoom0 = border.sidecell[0].ice();
				if (iceInRoom0 === border.sidecell[1].ice()) {
					continue;
				}
				var iceRoom = border.sidecell[iceInRoom0 ? 0 : 1].room;
				var landRoom = border.sidecell[iceInRoom0 ? 1 : 0].room;
				var idx = iceRoom.clist[0].id;
				if (neighbors[idx] === undefined) {
					neighbors[idx] = [];
				}
				neighbors[idx].push(landRoom);
			}
			for (var id in neighbors) {
				var pair = neighbors[id];
				var mark = pair[0].markType;
				if (pair.length === 2 && mark >= 0 && mark === pair[1].markType) {
					this.failcode.add("bkSameMarksPassed");
					if (this.checkOnly) {
						break;
					}
					for (var j = 0; j < 2; j++) {
						pair[j].clist
							.filter(function(cell) {
								return cell.qnum >= 0;
							})
							.seterr(1);
					}
				}
			}
		},

		checkCrossOutOfIce: function() {
			this.checkAllCell(function(cell) {
				return cell.lcnt === 4 && !cell.ice();
			}, "lnCrossExIce");
		},

		checkNoLineOnNum: function() {
			this.checkAllCell(function(cell) {
				return cell.qnum !== -1 && cell.lcnt === 0;
			}, "lnIsolate");
		}
	}
});
