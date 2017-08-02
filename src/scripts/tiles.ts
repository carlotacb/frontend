class Tile{
	container: Element;
	constructor(){
		this.container = document.createElement("div");
		this.container.classList.add("tile");
	}

	paint(c: TileColors, timeout: number = 2500){
		let cssClass: string = "";
		
		switch(c){
			case TileColors.Red:
				cssClass = "red";
				break;
			case  TileColors.Yellow:
				cssClass = "yellow";
				break;
			case TileColors.Green:
				cssClass = "green";
				break;
		}
		this.container.classList.add(cssClass);
		setTimeout(() => {

			this.container.classList.remove(cssClass);
		}, timeout);
	}

	clear(){
		this.container.classList.remove ("red");
		this.container.classList.remove ("yellow");
		this.container.classList.remove ("green");
	}


}

class TileRow{
	container: Element;
	private _tiles: Array<Tile>;

	constructor(){
		this._tiles = new Array();
		this.container = document.createElement("div");
		this.container.classList.add("tiles-row");
	}

	add(t: Tile){
		this.container.appendChild(t.container);
		this._tiles.push(t);
	}

	paint(c: TileColors, timeout: number = 2500){
		for(let tile of this._tiles) {
			tile.paint(c, timeout);
		}
	}

	clear(){
		for(let tile of this._tiles) {
			tile.clear();
		}
	}
	getTile(i: number){
		return this._tiles[i];
	}
}

enum TileGridState{
	Static,
	Random
};

enum TileColors{
	Yellow,
	Red,
	Green
};

class TileGrid {
	container: Element;
	readonly tickDelay: number = 200;
	private _rows: Array<TileRow>;
	private _currentState: TileGridState;
	private _lastState: TileGridState;

	//Number of horizontal rows
	private _n: number;
	//Tiles per row
	private _m: number;

	//Tiles are squares, so we only need the width
	constructor(windowWidth: number, windowHeight: number, 
				tileWidth: number = 120, 
				containerSelector: string = "#background")	{
		
		this._rows = new Array();
		this._currentState = TileGridState.Random;
		

		this._n = window.innerHeight / tileWidth * 2 + 1;
		this._m = window.innerWidth / tileWidth + 1;
		this.container = document.querySelector(containerSelector);

		for (let i = 0; i < this._n; i++) {
			let row = new TileRow();
			
			for (let j = 0; j < this._m; j++) {
				let tile = new Tile();
				row.add(tile);
			}

			this.container.appendChild (row.container);
			this._rows.push(row);
		}
		var that = this;
		setInterval(() => this.tick(), this.tickDelay);
	}

	tick(){

        if (this._lastState != this._currentState) {
            this.clear();
        }
        if (this._currentState == TileGridState.Random) {
            this._lastState = TileGridState.Random;
            
            let i = Math.floor (Math.random() * this._n);
            let j = Math.floor (Math.random() * this._m);

            let rand = Math.random();
            if ( rand < 0.33) {
                this._rows[i].getTile(j).paint(TileColors.Yellow);
            }
            else if (rand < 0.66) {
                this._rows[i].getTile(j).paint(TileColors.Green);
            }
            else {
                this._rows[i].getTile(j).paint(TileColors.Red);
            }
        }
        else if (this._currentState == TileGridState.Static) {
            this._lastState = TileGridState.Static;

            for (let row in this._rows) {
            	let i = Number(row);
                if(i < this._n * 0.25)
					this._rows[i].paint(TileColors.Yellow);
                else if(i > this._n * 0.75)
					this._rows[i].paint(TileColors.Red);
                
            }
        }
	}

	changeState(){
		this._currentState = (this._currentState + 1) % 2;
	}

	clear(){
		for(let row of this._rows) {
			row.clear();
		}
	}
}

document.addEventListener ("DOMContentLoaded", function () {
    let tg = new TileGrid(window.innerWidth, window.innerHeight);
    
    document.body.addEventListener ("click", function () {
        tg.changeState();
    });

});