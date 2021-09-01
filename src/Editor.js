export default function Editor({ $target, initialState, onEditing, onSave, onRemove, onFav }) {
  const $editor = document.createElement('div');
  $editor.id = 'editor';
  $target.appendChild($editor);

  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  $editor.innerHTML = `
  <button class="add-fav">즐겨찾기</button>
  <input id="title" autoComplete="off" type="text" name="title" style="width: 600px" placeholder="제목 없음"/>
  <textarea name="content" style="width: 600px; height: 480px; padding: 8px" placeholder="내용을 입력하세요"></textarea>
  <button class="remove">삭제</button>
  `;

  $editor.querySelector('[name=title]').addEventListener('keyup', (e) => {
    const nextState = {
      ...this.state,
      title: e.target.value,
    };
    this.setState(nextState);
    onEditing(this.state);
  });

  $editor.querySelector('[name=content]').addEventListener('keyup', (e) => {
    const nextState = {
      ...this.state,
      content: e.target.value,
    };
    this.setState(nextState);
    onEditing(this.state);
  });

  $editor.addEventListener('click', (e) => {
    const { className } = e.target;
    if (className === 'remove') {
      onRemove(this.state);
    } else if (className === 'add-fav') {
      onFav(this.state);
    }
  });

  this.render = () => {
    $editor.querySelector('[name=title]').value = this.state.title;
    $editor.querySelector('[name=content]').value = this.state.content;
  };
}
