import { getItem, setItem } from './storage.js';

export default function Trash({ $target, initialState, xPos, yPos, onRestore }) {
  const $trash = document.createElement('div');
  $trash.id = 'trash-list';

  this.state = getItem('trash', {});
  this.xPos = xPos;
  this.yPos = yPos;

  this.setPos = (newX, newY) => {
    this.xPos = newX;
    this.yPos = newY;
  };

  this.setState = (nextState) => {
    this.state = nextState;
    setItem('trash', nextState);
    //this.render();
  };

  this.render = () => {
    const $oldTrash = document.querySelector('#trash-list');

    if ($oldTrash !== null) {
      $target.removeChild($oldTrash);
    }

    console.log(this.xPos, this.yPos);

    $trash.style.top = `${this.yPos}`;
    $trash.style.left = `${this.xPos}`;

    $target.appendChild($trash);

    $trash.innerHTML = `
    <button class="all-remove">모두 비우기</button><button class="close-trash">닫기</button>
      ${
        Object.entries(this.state).length
          ? `<ul>
          ${Object.entries(this.state)
            .map(
              ([key, value]) =>
                `<li data-id="${parseInt(key)}" data-parent="${value.parent}">${value.title}
                <button class="restore">
                  <svg viewBox="0 0 100 100" class="undo" style="width: 18px; height: 18px; display: block; fill: inherit; flex-shrink: 0; backface-visibility: hidden;">
                    <path d="M74.256,36.006 C62.043,23.791 43.268,21.352 28.374,29.957 L21.145,17.533 L14.582,42.359 L39.41,48.923 L31.899,36.015 C44.047,29.011 59.346,30.995 69.306,40.954 C79.402,51.052 81.322,66.638 73.975,78.858 L79.975,82.465 C88.981,67.484 86.63,48.379 74.256,36.006 Z"></path>
                  </svg>
                </button>
                <button class="eliminate">
                  <svg viewBox="0 0 30 30" class="trash" style="width: 18px; height: 18px; display: block; fill: inherit; flex-shrink: 0; backface-visibility: hidden;">
                    <path d="M21,5c0-2.2-1.8-4-4-4h-4c-2.2,0-4,1.8-4,4H2v2h2v22h22V7h2V5H21z M13,3h4c1.104,0,2,0.897,2,2h-8C11,3.897,11.897,3,13,3zM24,27H6V7h18V27z M16,11h-2v12h2V11z M20,11h-2v12h2V11z M12,11h-2v12h2V11z"></path>
                  </svg>
                </button></li>
                
            `
            )
            .join('')}
        </ul>
    `
          : '<div>휴지통이 비었습니다!</div>'
      }`;
  };

  $trash.addEventListener('click', (e) => {
    const { className } = e.target;
    switch (className) {
      case 'all-remove': // 모두 영구 삭제
        this.setState({});
        this.render();
        break;
      case 'close-trash': // 휴지통 닫기
        console.log('hi');
        $target.removeChild($trash);
        break;
      case 'eliminate': // 영구 삭제
        const $li = e.target.closest('li');
        const { id } = $li.dataset;
        console.log(id);
        console.log(this.state);
        delete this.state[id];
        setItem('trash', this.state);
        this.render();
        break;
      case 'restore': // 서버에 다시 보내기
        const $li2 = e.target.closest('li');
        const id2 = $li2.dataset.id;
        console.log(this.state[id2]);
        onRestore(this.state[id2]);
        delete this.state[id2];
        setItem('trash', this.state);
        this.render();
        break;
      default:
        break;
    }
  });

  //this.render();
}
