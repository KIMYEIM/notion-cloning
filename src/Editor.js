export default function Editor({ $target, initialState, onHide, onEditing, onRemove, onFav, onChild }) {
  const $editor = document.createElement('div');
  $editor.id = 'editor';
  $target.appendChild($editor);

  $editor.innerHTML = `
          <button class="hide"><<</button>
          <div id="editor-buttons">
          <button class="add-fav">즐겨찾기</button><button class="remove">삭제</button>
          </div>
          <input id="emoji" type="text" name="emoji" autoComplete="off" placeholder="🙂"/>
          <input id="title" autoComplete="off" type="text" name="title" placeholder="제목 없음"/>
          <textarea id="content" name="content" placeholder="내용을 입력하세요"></textarea>
          <div id="child-docs"></div>
        `;

  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    console.log('render editor');
    const $childDocs = $editor.querySelector('#child-docs');
    if (this.state.documents) {
      $childDocs.innerHTML = `<ul id="child-docs">
                ${this.state.documents.map(({ id, title }) => `<li class="child" data-id="${id}">${title}</li>`).join('')}
                </ul>`;
    } else {
      $childDocs.innerHTML = '';
    }

    // $editor.innerHTML = `
    //       <button class="hide"><<</button>
    //       <div id="editor-buttons">
    //       <button class="add-fav">즐겨찾기</button><button class="remove">삭제</button>
    //       </div>
    //       <input id="emoji" type="text" name="emoji" autoComplete="off" placeholder="🙂"/>
    //       <input id="title" autoComplete="off" type="text" name="title" placeholder="제목 없음"/>
    //       <textarea id="content" name="content" placeholder="내용을 입력하세요">
    //       </textarea>
    //       ${
    //         this.state.documents
    //           ? `<ul id="child-docs">
    //             ${this.state.documents.map(({ id, title }) => `<li class="child" data-id="${id}">${title}</li>`).join('')}</ul>`
    //           : ''
    //       }
    //     `;

    //}
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
    // }
    const [emoji, title] = this.state.title.split('<span>&nbsp;</span>');
    if (title) {
      $editor.querySelector('[name=emoji]').value = emoji;
      $editor.querySelector('[name=title]').value = title;
    } else {
      $editor.querySelector('[name=emoji]').value = '';
      $editor.querySelector('[name=title]').value = this.state.title;
    }
    $editor.querySelector('[name=content]').value = this.state.content;
  };

  $editor.addEventListener('keyup', (e) => {
    console.error(this.state);
    const { id } = e.target;
    switch (id) {
      case 'title':
      case 'emoji':
        const emoji = $editor.querySelector('[name=emoji]');
        const title = $editor.querySelector('[name=title]');
        const titleModified = {
          ...this.state,
          title: emoji.value + '<span>&nbsp;</span>' + title.value,
        };
        this.state = titleModified;
        onEditing(this.state);
        break;
      case 'content':
        const contentModified = {
          ...this.state,
          content: e.target.value,
        };
        this.state = contentModified;
        onEditing(this.state);
        break;
      default:
        break;
    }
  });

  let isToggled = false;

  $editor.addEventListener('click', (e) => {
    const { className } = e.target;
    switch (className) {
      case 'hide':
        onHide(e, isToggled);
        // const $list = document.querySelector('#list');
        // if (isToggled) {
        //   $list.style.marginLeft = '0px';
        //   e.target.textContent = '<<';
        //   isToggled = !isToggled;
        // } else {
        //   e.target.textContent = '>>';
        //   //$list.style.display = 'none';
        //   $list.style.marginLeft = '-265px';
        //   isToggled = !isToggled;
        // }
        break;
      case 'child':
        const $li = e.target.closest('li');
        const { id } = $li.dataset;
        onChild(id);
        break;
      case 'remove':
        onRemove(this.state);
        break;
      case 'add-fav':
        onFav(this.state);
        break;
      default:
        break;
    }
  });
}
