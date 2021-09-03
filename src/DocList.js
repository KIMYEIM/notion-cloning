import { request } from './api.js';
import { getItem, setItem } from './storage.js';

export default function DocList({ $target, initialState, onClick, onAdd, onToggle, onTrash }) {
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

  const childDoc = ($toggled, $child, parent = null, depth = 1) => {
    return $child.length
      ? `
      <ul>
      ${$child
        .map(
          ({ id, title, documents }) =>
            `<li class="doc" data-parent=${parent} data-id=${id} style="padding-left: ${depth * 15}px">
            <button class="toggle" style="visibility: ${documents.length ? 'visible' : 'hidden'}">
            ${isCheck($toggled, id) ? '▼' : '▶︎'}</button>
            ${title} 
            <button class="add">+</button></li>
          ${isCheck($toggled, id) ? childDoc($toggled, documents, id, depth + 1) : ''}`
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
    <h4 class="trash">🗑&nbsp;휴지통</h4>
      <div style="height: 70px"></div>
      <button class="new-doc" >+ 새 페이지</button>
      `;
  };

  $list.addEventListener('click', (e) => {
    const { className } = e.target;
    switch (className) {
      case 'add':
      case 'new-doc':
        onAdd(e.target);
        break;
      case 'toggle':
        onToggle(e.target);
        break;
      case 'doc':
        onClick(e.target);
        break;
      case 'trash':
        console.log(e.target);
        console.log(e.clientX, e.clientY);
        onTrash(e.clientX, e.clientY);
      default:
        break;
    }
  });
}
