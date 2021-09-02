export default function Editor({ $target, initialState, onEditing, onRemove, onFav, onChild }) {
  const $editor = document.createElement('div');
  $editor.id = 'editor';
  $target.appendChild($editor);

  let isInit = true;

  /*
  $editor.innerHTML = `
          <div id="editor-buttons">
          <button class="add-fav">즐겨찾기</button><button class="remove">삭제</button>
          </div>
          <input id="title" autoComplete="off" type="text" name="title" style="width: 600px" placeholder="제목 없음"/>
          <textarea id="content" name="content" style="width: 600px; height: 480px; padding: 8px" placeholder="내용을 입력하세요"></textarea>
          <div id="child-docs"></div>
        `;*/

  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    console.log('render editor');
    console.error(this.state);
    $editor.innerHTML = `
          <div id="editor-buttons">
          <button class="add-fav">즐겨찾기</button><button class="remove">삭제</button>
          </div>
          <input id="emoji" type="text" name="emoji" autoComplete="off" placeholder="🙂"/>
          <input id="title" autoComplete="off" type="text" name="title" placeholder="제목 없음"/>
          <textarea id="content" name="content" placeholder="내용을 입력하세요">
          </textarea>
          ${
            this.state.documents
              ? `<ul id="child-docs">
                ${this.state.documents.map(({ id, title }) => `<li class="child" data-id="${id}">${title}</li>`).join('')}</ul>`
              : ''
          }
        `;

    // if (this.state.documents) {
    //   $editor.innerHTML += `
    //   <ul id="child-docs">
    //   ${this.state.documents
    //     .map(
    //       ({ id, title }) =>
    //         `
    //     <li class="child" data-id="${id}">${title}</li>
    //     `
    //     )
    //     .join('')}
    //   </ul>
    // `;
    //}
    if (this.state.title !== '') {
      const [emoji, title] = this.state.title.split('<span>&nbsp;</span>');
      $editor.querySelector('[name=emoji]').value = emoji;
      $editor.querySelector('[name=title]').value = title;
    } else {
      $editor.querySelector('[name=emoji]').value = '';
      $editor.querySelector('[name=title]').value = this.state.title;
    }
    $editor.querySelector('[name=content]').value = this.state.content;
  };

  $editor.addEventListener('keyup', (e) => {
    const { id } = e.target;
    if (id === 'title') {
      const emoji = $editor.querySelector('[name=emoji]');
      const nextState = {
        ...this.state,
        title: emoji.value + '<span>&nbsp;</span>' + e.target.value,
      };
      //this.setState(nextState);
      onEditing(nextState);
    } else if (id === 'content') {
      const nextState = {
        ...this.state,
        content: e.target.value,
      };
      //this.setState(nextState);
      onEditing(nextState);
    }
  });

  $editor.addEventListener('click', (e) => {
    const { className } = e.target;

    if (className === 'child') {
      const $li = e.target.closest('li');
      const { id } = $li.dataset;
      onChild(id);
    } else if (className === 'remove') {
      onRemove(this.state);
    } else if (className === 'add-fav') {
      onFav(this.state);
    }
  });
}
