var DisplayMessage = {
  WON_MSG: 'Congradulations you\'ve won.',
  LOST_MSG: 'You\'ve lost, better luck next time.',
  DRAW_MSG: 'This game ended with a draw. ',
  MULTI_MODE_WIN_MSG: ' \'s won the game',
};

var ViewController = {
  _x: "<img src=\"img/x.png\"/> ",
  _o: "<img src=\"img/o.png\"/> ",

  _sign: 'x', // default game if user doesn't input one

  _isYourTurn: true,

  _twoPlayerMode: true,
  _playerOneTurn: true,
  _canPlaceMove: true,

  _winningMoves: [
    ['r1c1', 'r1c2', 'r1c3'],
    ['r2c1', 'r2c2', 'r2c3'],
    ['r3c1', 'r3c2', 'r3c3'],
    ['r1c1', 'r2c1', 'r3c1'],
    ['r1c2', 'r2c2', 'r3c2'],
    ['r1c3', 'r2c3', 'r3c3'],
    ['r1c1', 'r2c2', 'r3c3'],
    ['r1c3', 'r2c2', 'r3c1']
  ],

  init: function() {
    View.init();
    alert("Please select a mode");
  },

  /**
   * @function updates the UI when the users clicks on a particular cell in
   *           the 3x3 grid
   * @param {Table>Tr>td
   *            on click event}
   */
  onGridClick: function(element) {
    if (!ViewController._isNotEmpty(element)) {
      if (!ViewController._twoPlayerMode) {
        ViewController.__singlePlayerModeProcess(element);
      } else {
        ViewController.__multiplePlayerModeProcess(element);
      }
    }
  },

  /**
   * @function changes from single player to two player
   */
  onModeChange: function() {
    var selectedOption = $('#mode input[name=player]:checked').val();
    console.log(selectedOption);
    View.clearScore();
    View.reset();

    if (selectedOption == 'one_player') {
      ViewController._twoPlayerMode = false;
    } else if (selectedOption == 'two_player') {
      ViewController._twoPlayerMode = true;
    } else {}
  },

  /**
   * @function changes the users sign from x to o or o to x
   */
  onCharacterChange: function() {
    var selectedOption = $('#sign input[name=character]:checked').val();
    console.log(selectedOption);

    ViewController.setSign(selectedOption);
    ViewController._isYourTurn = true;
    View.clearScore();
    View.reset();
  },

  /**
   * @function clears the board
   */
  onResetClick: function() {
    ViewController._isYourTurn = true;
    ViewController._canPlaceMove = true;

    View.showHide("info", false);
    View.showHide("image", false);
    View.resetStrikeImage();
    View.reset();
  },

  /**
   * @function changes the users character to X | O
   * @param {Stringx | o }
   */
  setSign: function(sign) {
    if (sign && sign.toLowerCase() == 'x') {
      ViewController._sign = 'x';
    } else if (sign && sign.toLowerCase() == 'o') {
      ViewController._sign = 'o';
    } else {
      throw 'Character not found';
    }
  },

  __updateScore: function(character) {
    if (character == 'x') {
      View.updateUI('x_score', parseInt(document
        .getElementById('x_score').innerHTML) + 1);
    } else {
      View.updateUI('o_score', parseInt(document
        .getElementById('o_score').innerHTML) + 1);
    }
  },

  __singlePlayerModeProcess: function(element) {
    if (ViewController._isYourTurn) {
      ViewController._isYourTurn = false;

      var userSign = (ViewController._sign == 'x') ?
        ViewController._x : ViewController._o;
      View.updateUI(element.currentTarget.id, userSign);

      try {
        ViewController._checkAndDisplayWinner();
        ViewController.aiPlaceLetter();
        ViewController._checkAndDisplayWinner();
      } catch (err) {
        View.updateUI("status", DisplayMessage.DRAW_MSG);
        View.showHide("info", true);
      }
    }
  },

  __multiplePlayerModeProcess: function(element) {
    if (ViewController._canPlaceMove) {
      if (ViewController._playerOneTurn) {
        ViewController._playerOneTurn = false;
        if (ViewController._sign == 'x') {
          View.updateUI(element.currentTarget.id,
            ViewController._x);
          ViewController._sign = 'o';
        }
      } else {
        ViewController._playerOneTurn = true;
        if (ViewController._sign == 'o') {
          View.updateUI(element.currentTarget.id,
            ViewController._o);
          ViewController._sign = 'x';
        }
      }

      if (ViewController._isThereAnyMovesLeft()) {
        ViewController._checkAndDisplayWinner();
      } else {
        View.updateUI("status", DisplayMessage.DRAW_MSG);
        View.showHide("info", true);
      }
    }
  },

  /**
   * @function check if table cell contains x.png | o.pngimage
   * @param {html on click event }
   */
  _isNotEmpty: function(element) {
    return (element.currentTarget.innerHTML.indexOf("x.png") != -1 ||
      element.currentTarget.innerHTML
      .indexOf("o.png") != -1);
  },

  /**
   * @function check to see which image is in the table cell
   * @param {id
   *            of the table cell}
   */
  _XorO: function(element) {
    var val = null;
    if (document.getElementById(element).innerHTML.indexOf("x.png") != -1) {
      val = 'x'
    } else if (document.getElementById(element).innerHTML.indexOf("o.png") != -1) {
      val = 'o'
    } else {}
    return val;
  },

  _isThereAnyMovesLeft: function() {
    var r1c1 = ViewController._XorO("r1c1");
    var r1c2 = ViewController._XorO("r1c2");
    var r1c3 = ViewController._XorO("r1c3");
    var r2c1 = ViewController._XorO("r2c1");
    var r2c2 = ViewController._XorO("r2c2");
    var r2c3 = ViewController._XorO("r2c3");
    var r3c1 = ViewController._XorO("r3c1");
    var r3c2 = ViewController._XorO("r3c2");
    var r3c3 = ViewController._XorO("r3c3");

    var moves = true;
    if (r1c1 && r1c2 && r1c3 && r2c1 &&
      r2c2 && r2c3 && r3c1 && r3c2 && r3c3) {
      moves = false;
    }
    return moves;
  },

  __gridDiagonalLength: function() {
    var grid = $("#grid");
    var aSquare = Math.pow(grid.height(), 2);
    var bSquare = Math.pow(grid.width(), 2);
    var cSquare = Math.sqrt(aSquare + bSquare);
    return cSquare;
  },

  /**
   * @function check if the user or computer won
   *       displays line strikethrough
   */
  _checkAndDisplayWinner: function() {
    var r1c1 = ViewController._XorO("r1c1");
    var r1c2 = ViewController._XorO("r1c2");
    var r1c3 = ViewController._XorO("r1c3");
    var r2c1 = ViewController._XorO("r2c1");
    var r2c2 = ViewController._XorO("r2c2");
    var r2c3 = ViewController._XorO("r2c3");
    var r3c1 = ViewController._XorO("r3c1");
    var r3c2 = ViewController._XorO("r3c2");
    var r3c3 = ViewController._XorO("r3c3");

    var image = $("#image");
    image.removeClass();

    var didSomeoneWin = false;
    var winner = null;

    var winningMovies = [{
      moves: [r1c1, r1c2, r1c3],
      css: { top: "170px", left: "10px" }
    }, {
      moves: [r2c1, r2c2, r2c3],
      css: { top: "350px", left: "10px" }
    }, {
      moves: [r3c1, r3c2, r3c3],
      css: { top: "525px", left: "10px" }
    }, {
      moves: [r1c1, r2c1, r3c1],
      css: { left: "100px", width: "515px" }
    }, {
      moves: [r1c2, r2c2, r3c2],
      css: { left: "280px", width: "515px" }
    }, {
      moves: [r1c3, r2c3, r3c3],
      css: { left: "460px", width: "515px" }
    }, {
      moves: [r1c1, r2c2, r3c3],
      dia: true,
      class: 'image rotate45'
    }, {
      moves: [r1c3, r2c2, r3c1],
      dia: true,
      class: 'image rotate315'
    }]

    $.each(winningMovies, function(index, obj) {
      var moves = obj.moves;
      if (moves[0] == moves[1] && moves[1] && moves[1] == moves[2]) {
        didSomeoneWin = true;

        winner = moves[0];

        if (!obj.dia) {
          image.css(obj.css);
        } else {
          var diagonalLength = ViewController.__gridDiagonalLength();
          image.width(diagonalLength);
          image.addClass(obj.class);
          image.css({ left: "0px" });
        }
      }
    });

    if (didSomeoneWin) {
      if (!ViewController._twoPlayerMode) {
        if (ViewController._sign == winner) {
          View.updateUI("status", DisplayMessage.WON_MSG);
          View.showHide("info", true);
          console.log("you won");
        } else {
          View.updateUI("status", DisplayMessage.LOST_MSG);
          View.showHide("info", true);
          console.log("you lost");
        }
      } else {
        View.showHide("info", true);
        View.updateUI("status", winner + DisplayMessage.MULTI_MODE_WIN_MSG);
        console.log(winner + "'s won");
      }
      View.showHide("image", true);
      ViewController.__updateScore(winner);
      ViewController._isYourTurn = false;
      ViewController._canPlaceMove = false;
    }
  },

  /**
   * @function unbeatable computer game logic
   */
  aiPlaceLetter: function() {
    var rowOneColumnOne = ViewController._XorO("r1c1");
    var rowOneColumnTwo = ViewController._XorO("r1c2");
    var rowOneColumnThree = ViewController._XorO("r1c3");

    var rowTwoColumnOne = ViewController._XorO("r2c1");
    var rowTwoColumnTwo = ViewController._XorO("r2c2");
    var rowTwoColumnThree = ViewController._XorO("r2c3");

    var rowThreeColumnOne = ViewController._XorO("r3c1");
    var rowThreeColumnTwo = ViewController._XorO("r3c2");
    var rowThreeColumnThree = ViewController._XorO("r3c3");

    var image;
    if (ViewController._sign == 'x') {
      image = ViewController._o;
    } else if (ViewController._sign == 'o') {
      image = ViewController._x;
    } else {
      throw 'error unable to determined sign';
    }

    ViewController._isYourTurn = true;

    /*
     * defensive moves
     */
    if (rowTwoColumnTwo == null) {
      View.updateUI("r2c2", image);
    } else if (rowOneColumnOne && rowOneColumnOne == rowOneColumnTwo &&
      rowOneColumnThree == null) {
      View.updateUI("r1c3", image);
    } else if (rowOneColumnTwo && rowOneColumnTwo ==
      rowOneColumnThree && rowOneColumnOne == null) {
      View.updateUI("r1c1", image);
    } else if (rowOneColumnOne && rowOneColumnOne ==
      rowOneColumnThree && rowOneColumnTwo == null) {
      View.updateUI("r1c2", image);
    } else if (rowTwoColumnTwo && rowTwoColumnTwo ==
      rowTwoColumnThree && rowTwoColumnOne == null) {
      View.updateUI("r2c1", image);
    } else if (rowTwoColumnThree && rowTwoColumnThree ==
      rowTwoColumnOne && rowTwoColumnTwo == null) {
      View.updateUI("r2c2", image);
    } else if (rowTwoColumnOne && rowTwoColumnOne == rowTwoColumnTwo &&
      rowTwoColumnThree == null) {
      View.updateUI("r2c3", image);
    } else if (rowThreeColumnOne && rowThreeColumnOne ==
      rowThreeColumnTwo && rowThreeColumnThree == null) {
      View.updateUI("r3c3", image);
    } else if (rowThreeColumnTwo && rowThreeColumnTwo ==
      rowThreeColumnThree && rowThreeColumnOne == null) {
      View.updateUI("r3c1", image);
    } else if (rowThreeColumnThree && rowThreeColumnThree ==
      rowThreeColumnOne && rowThreeColumnTwo == null) {
      View.updateUI("r3c2", image);
    } else if (rowOneColumnOne && rowOneColumnOne == rowTwoColumnOne &&
      rowThreeColumnOne == null) {
      View.updateUI("r3c1", image);
    } else if (rowTwoColumnOne && rowTwoColumnOne ==
      rowThreeColumnOne && rowOneColumnOne == null) {
      View.updateUI("r1c1", image);
    } else if (rowThreeColumnOne && rowThreeColumnOne ==
      rowOneColumnOne && rowTwoColumnOne == null) {
      View.updateUI("r2c1", image);
    } else if (rowOneColumnTwo && rowOneColumnTwo == rowTwoColumnTwo &&
      rowThreeColumnTwo == null) {
      View.updateUI("r3c2", image);
    } else if (rowTwoColumnTwo && rowTwoColumnTwo ==
      rowThreeColumnTwo && rowOneColumnTwo == null) {
      View.updateUI("r1c2", image);
    } else if (rowThreeColumnTwo && rowThreeColumnTwo ==
      rowOneColumnTwo && rowTwoColumnTwo == null) {
      View.updateUI("r2c2", image);
    } else if (rowOneColumnThree && rowOneColumnThree ==
      rowTwoColumnThree && rowThreeColumnThree == null) {
      View.updateUI("r3c3", image);
    } else if (rowTwoColumnTwo && rowTwoColumnTwo ==
      rowThreeColumnThree && rowOneColumnThree == null) {
      View.updateUI("r1c3", image);
    } else if (rowThreeColumnThree && rowThreeColumnThree ==
      rowOneColumnThree && rowTwoColumnThree == null) {
      View.updateUI("r2c3", image);
    } else if (rowOneColumnOne && rowOneColumnOne == rowTwoColumnTwo &&
      rowThreeColumnThree == null) {
      View.updateUI("r3c3", image);
    } else if (rowTwoColumnTwo && rowTwoColumnTwo ==
      rowThreeColumnThree && rowOneColumnOne == null) {
      View.updateUI("r1c1", image);
    } else if (rowThreeColumnThree && rowThreeColumnThree ==
      rowOneColumnOne && rowTwoColumnTwo == null) {
      View.updateUI("r2c2", image);
    } else if (rowThreeColumnOne && rowThreeColumnOne ==
      rowTwoColumnTwo && rowOneColumnThree == null) {
      View.updateUI("r1c3", image);
    } else if (rowOneColumnThree && rowOneColumnThree ==
      rowThreeColumnOne && rowTwoColumnTwo == null) {
      View.updateUI("r2c2", image);
    } else if (rowTwoColumnTwo && rowTwoColumnTwo ==
      rowOneColumnThree && rowThreeColumnOne == null) {
      View.updateUI("r3c1", image);
    } else if (rowTwoColumnThree && rowTwoColumnThree ==
      rowThreeColumnTwo && rowThreeColumnThree == null) {
      View.updateUI("r3c3", image);
    } else if (rowOneColumnOne && rowOneColumnOne ==
      rowThreeColumnThree && rowThreeColumnTwo == null) {
      View.updateUI("r3c2", image);
    } else if (rowOneColumnThree && rowOneColumnThree ==
      rowThreeColumnOne && rowTwoColumnOne == null) {
      View.updateUI("r2c1", image);
    } else if (rowOneColumnOne && rowOneColumnOne ==
      rowThreeColumnTwo && rowThreeColumnOne == null) {
      View.updateUI("r3c1", image);
    } else if (rowOneColumnThree && rowOneColumnThree ==
      rowThreeColumnTwo && rowThreeColumnThree == null) {
      View.updateUI("r3c3", image);
    } else if (rowTwoColumnThree && rowTwoColumnThree ==
      rowThreeColumnOne && rowThreeColumnThree == null) {
      View.updateUI("r3c3", image);
    } else if (!rowOneColumnOne) {
      View.updateUI("r1c1", image);
    } else if (!rowOneColumnThree) {
      View.updateUI("r1c3", image);
    } else if (!rowThreeColumnOne) {
      View.updateUI("r3c1", image);
    } else if (!rowThreeColumnThree) {
      View.updateUI("r3c3", image);
    } else if (!rowOneColumnTwo) {
      View.updateUI("r1c2", image);
    }

    /*
     * defensive moves end
     */
    else {
      throw "No more moves";
    }

  },
};
