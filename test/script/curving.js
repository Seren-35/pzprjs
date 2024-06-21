/* curving.js */

ui.debug.addDebugData("curving", {
	url: "6/6/g2g20920",
	failcheck: [
		[
			"csAdjacent",
			"pzprv3/curving/6/6/1 . . . . . /. . 1 . 1 . /. . . . . . /1 . . . . . /. . 1 . . 1 /. . . 1 . . /. . . . . . /. . . # . . /# . . . . . /. . . # . . /. . . # . . /. . # . . # /"
		],
		[
			"cuDivideRB",
			"pzprv3/curving/6/6/1 . . . . . /. . 1 . 1 . /. . . . . . /1 . . . . . /. . 1 . . 1 /. . . 1 . . /. . . . . . /# . . # . . /. # . . . . /. . # . . . /. . . # . . /. . # . . . /"
		],
		[
			"curvingNoTurns",
			"pzprv3/curving/6/6/1 . . . . . /. . 1 . 1 . /. . . . . . /1 . . . . . /. . 1 . . 1 /. . . 1 . . /. . # . . . /# . . . . . /. . # . # . /. # . . . # /# . . # . . /. . # . . # /"
		],
		[
			"curvingNoTurns",
			"pzprv3/curving/6/6/1 . . . . . /. . 1 . 1 . /. . . . . . /1 . . . . . /. . 1 . . 1 /. . . 1 . . /. . # . . . /# . . # . # /. . . . . . /. # . . # . /# . . # . . /. . # . . # /"
		],
		[
			"curvingOneTurn",
			"pzprv3/curving/6/6/1 . . . . . /. . 1 . 1 . /. . . . . . /1 . . . . . /. . 1 . . 1 /. . . 1 . . /. . # . . . /# . . # . # /. # . . . . /. . # . # . /# . . # . . /. . . . . # /"
		],
		[
			"curvingOneTurn",
			"pzprv3/curving/6/6/1 . . . . . /. . 1 . 1 . /. . . . . . /1 . . . . . /. . 1 . . 1 /. . . 1 . . /. . # . . # /# . . # . . /. . . . # . /. . # . . . /# . . # . . /. . # . . # /"
		],
		[
			null,
			"pzprv3/curving/6/6/1 . . . . . /. . 1 . 1 . /. . . . . . /1 . . . . . /. . 1 . . 1 /. . . 1 . . /. + # + + + /# + . # . # /+ + + + + + /. + # + # + /# + . # + . /+ + # . + # /"
		]
	],
	inputs: [
		{ input: ["newboard,4,4", "editmode"] },
		{
			input: ["mouse,left, 1,1, 7,1, 7,7, 1,7"],
			result: "pzprv3/curving/4/4/1 . 1 . /. . . 1 /. . . . /. 1 . 1 /. . . . /. . . . /. . . . /. . . . /"
		},
		{
			input: ["mouse,left, 1,3, 7,3, 7,5, 1,5"],
			result: "pzprv3/curving/4/4/1 . 1 . /1 . 1 1 /. 1 . 1 /. 1 . 1 /. . . . /. . . . /. . . . /. . . . /"
		},
		{
			input: ["mouse,left, 1,1, 7,1, 7,7, 1,7, 1,1"],
			result: "pzprv3/curving/4/4/. . . . /. . 1 . /. 1 . . /. . . . /. . . . /. . . . /. . . . /. . . . /"
		}
	]
});