import { request } from './api.js';
import { getItem, setItem } from './storage.js';

export default function DocList({ $target, initialState, onClick, onAdd, onToggle }) {
  const $list = document.createElement('div');
  $list.id = 'list';

  $target.appendChild($list);

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  const isCheck = ($array, id) => {
    return $array.includes(id);
  };

  const childDoc = ($toggled, $child) => {
    return $child.length
      ? `
      <ul>
      ${$child
        .map(
          ({ id, title, documents }) =>
            `<li class="doc" data-id=${id}>
            <button class="toggle" style="visibility: ${documents.length ? 'visible' : 'hidden'}">
            ${isCheck($toggled, id) ? '▼' : '▶︎'}</button>
            ${title} 
            <button class="add">+</button></li>
          ${isCheck($toggled, id) ? childDoc($toggled, documents) : ''}`
        )
        .join('')}
      </ul>
    `
      : '';
  };

  this.render = () => {
    console.log('render docList');
    const $toggled = getItem('toggled', []);
    const $favorites = getItem('favorites', []);

    console.log(this.state);

    $list.innerHTML = `
    <h3 id="root">🐻 예임의 Notion</h3>
    <h4>즐겨찾기</h4>
    <ul id="fav-list">
      ${Object.entries($favorites)
        .map(([key, values]) => `<li class="doc" data-id=${key}>${values}</li>`)
        .join('')}
      </ul>
    <h4 class="doc">개인 페이지 <button class="add">+</button></h4>
      ${childDoc($toggled, this.state)}
      <button class="new-doc" >+ 새 페이지</button>
      `;
  };

  $list.addEventListener('click', (e) => {
    const { className } = e.target;
    if (className === 'add' || className === 'new-doc') {
      onAdd(e.target);
    } else if (className === 'toggle') {
      onToggle(e.target);
    } else if (className === 'doc') {
      onClick(e.target);
    }
  });
}
