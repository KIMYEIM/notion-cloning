export default function Trash({ $target, initialState, xPos, yPos }) {
  const $trash = document.createElement('div');
  $trash.id = 'trash-list';
  $trash.style.position = 'absolute';
  $trash.style.backgroundColor = 'white';
  $trash.style.width = '250px';
  //$trash.style.height = '250px';
  $trash.style.boxShadow = '0px 0px 3px rgba(114, 112, 108, 0.3)';
  //$trash.style.border = '1px solid #e8e6e4';
  $trash.style.color = '#383530';
  $trash.style.borderRadius = '5%';
  $trash.style.padding = '30px';
  $trash.style.top = `${yPos}`;
  $trash.style.left = `${xPos}`;

  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    const $oldTrash = document.querySelector('#trash-list');

    if ($oldTrash !== null) {
      $target.removeChild($oldTrash);
    }

    $target.appendChild($trash);

    $trash.innerHTML = `
    <button class="all-remove">모두 비우기</button><button class="close-trash">닫기</button>
      ${
        Object.entries(this.state).length
          ? `<ul>
          ${Object.entries(this.state)
            .map(
              ([key, value]) =>
                `<li data-id="${parseInt(key)}" data-parent="${value.parent}">${
                  value.title
                }<button class="restore">↩︎</button><button class="eliminate">x</button></li>
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
      case 'all-remove':
        break;
      case 'close-trash':
        console.log('hi');
        $target.removeChild($trash);
        break;
      case 'eliminate':
        break;
      case 'restore':
        break;
      default:
        break;
    }
  });

  //this.render();
}
