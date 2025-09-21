export class GameField {
  constructor(element) {
    this._element = element;
    this.started = false;
    this.goblin = null;
    this.interval = null;
    this.pos = -1;
    this.knocked = false;
    this.knockedVal = 0;
    this.miss = 0;
  }

  startGame() {
    this._createCells();
    const cells = this._element.querySelectorAll(".cell");
    this._createGoblin();
    this._addCellClickListeners(cells);
    this._startGoblinMovement(cells);
    this.started = true;
    this._moveGoblin(cells);
  }

  _addCellClickListeners(cells) {
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        if (cell.classList.contains("withGoblin")) {
          this.knocked = true;
          this.knockedVal += 1;
          document.querySelector("input").value = this.knockedVal;
          this._resetGoblinMovement(cells);
        }
      });
    });
  }

  resetGame() {
    clearInterval(this.interval);
    this._element.innerHTML = "";
    this.started = false;
    document.querySelectorAll("input").forEach((element) => {
      element.value = 0;
    });
    this.knockedVal = 0;
    this.knocked = false;
    this.miss = 0;
  }

  _createCells() {
    for (let i = 0; i < 16; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      this._element.appendChild(cell);
    }
  }

  _createGoblin() {
    const goblin = document.createElement("div");
    goblin.classList.add("goblin");
    goblin.addEventListener('mouseenter', () => {
      goblin.classList.add('scale');
    });
    goblin.addEventListener('mouseleave', () => {
      goblin.classList.remove('scale');
    });  
    this.goblin = goblin;
  }

  _moveGoblin(cells) {
    let newPos;
    do {
      newPos = this._getRandomInt(0, 16);
    } while (this.pos === newPos);
    
    if (this.pos !== -1) {
      cells[this.pos].classList.remove("withGoblin");
    }
    this.pos = newPos;
    const cellWithGoblin = cells[newPos];
    cellWithGoblin.appendChild(this.goblin);
    cellWithGoblin.classList.add("withGoblin");
    
  }

  _getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  _startGoblinMovement(cells) {
    this.interval = setInterval(() => {
      this._moveGoblin(cells);
      if (this.knocked === false) {
        this.miss += 1;
        document.querySelector('input.miss').value = this.miss;
      }
      setTimeout(() => {
      if (this.miss === 5) {
        alert('вы проиграли =(');
        this.resetGame();
      }
    }, 1);
    },1000);
    
  }

  _resetGoblinMovement(cells) {
    this._moveGoblin(cells);
    clearInterval(this.interval);
    this._startGoblinMovement(cells);
    this.knocked = false;
  }
}
