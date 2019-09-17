const xlinkNS = 'http://www.w3.org/1999/xlink';
const svgNS = 'http://www.w3.org/2000/svg';

function attr(element, attrs) {
  Object.keys(attrs).forEach(key => {
    if (key.slice(0, 6) === 'xlink:') {
      element.setAttributeNS(xlinkNS, key.slice(6), attrs[key]);
      return;
    }
    element.setAttribute(key, attrs[key]);
  });
}

function createSprite(href, x, y, width = 64, height = 64) {
  const useElement = document.createElementNS(svgNS, "use");
  attr(useElement, { 'xlink:href': href, x, y, width, height });
  return useElement;
}

function createMap(asciiMap) {
  return asciiMap.map(line => line.split('')) || [];
}

class GoB {
  constructor(world) {
    this.world = world || document.querySelector('#board');
    this.spriteMap = {
      '1': '#one',
      'o': '#onemove',
      '2': '#two',
      't': '#twomove',
      '#': '#block'
    };
    this.level = createMap([
      "1o#################",
      "o##################",
      "###################",
      "###################",
      "###################",
      "###################",
      "###################",
      "###################",
      "###################",
      "##################t",
      "#################t2"
    ]);
    if (this.level.length === 0 || this.level[0].length === 0) {
      throw new Error('no level loaded.');
    }
    this.yDim = this.level.length;
    this.xDim = this.level[0].length;
    this.gameOver = false;
    this.player = {
      head: null,
      tail: null,
      x: 0,
      y: 0,
      tailCoords: []
    }
  }

  getField(x, y) {
    return this.level[y][x] || '#'
  }

  setField(x, y, value) {
    this.level[y][x] = value;
  }


  setup() {
    this.initialRender();
  }

  initialRender() {
    this.world.childNodes.forEach(node => node.remove());
    this.level.forEach((line, y) => {
      line.forEach((col, x) => {
        if (col === 'x') {
          col = ' ';
          this.player.x = x;
          this.player.y = y;
          this.setField(x,y, ' ');
        }
        const sprite = createSprite(this.spriteMap[col], x * 64, y * 64);
        this.world.appendChild(sprite);
        

      });
    });
    this.player.head = createSprite('#snakeHead', this.player.x * 64, this.player.y * 64);
    this.player.tail = document.createElementNS(svgNS, 'path');
    attr(this.player.tail, {
      'class': 'snake__tail',
    });
    this.world.appendChild(this.player.tail);
    this.world.appendChild(this.player.head);
  }
}

const game = new GoB();
game.setup();