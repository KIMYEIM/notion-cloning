import DocList from './DocList.js';
import Editor from './Editor.js';
import { request } from './api.js';
import { initRouter, push } from './router.js';
import { getItem, setItem } from './storage.js';
import Trash from './Trash.js';

export default function App({ $target }) {
  const $trash = new Trash({
    $target: $target,
    initialState: {},
    xPos: 70,
    yPos: 290,
    onRestore: async (docInfo) => {
      const { parent, title, content } = docInfo;
      //
      const createdDoc = await request(`/documents`, {
        method: 'POST',
        body: JSON.stringify({
          title: title,
          parent: parent,
        }),
      });
      if (content !== '') {
        await request(`/documents/${createdDoc.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: title,
            content: content,
          }),
        });
      }
      //history.replaceState(null, null, `/documents/${createdDoc.id}`);
      //editor.setState({ ...createdDoc, content: content });
      fetchList();
    },
  });

  const docList = new DocList({
    $target,
    initialState: [],
    onClick: async ($li) => {
      console.log($li);
      if ($li.tagName === 'H4') {
        push('/');
      } else {
        const { id, parent } = $li.dataset;
        history.pushState(null, null, `/documents/${id}`);
        await fetchDoc(id);
        editor.setState({ ...editor.state, parent: parent });
        console.log(editor.state);
      }
    },
    onAdd: ($button) => {
      const $li = $button.closest('li');
      const next = { id: $li ? parseInt($li.dataset.id) : null, title: '', content: '' };
      editor.setState(next);
      history.pushState(null, null, `/`);
    },
    onToggle: ($tog) => {
      const $li = $tog.closest('li');
      const id = parseInt($li.dataset.id);
      const togList = getItem('toggled', []);
      const togIdx = togList.indexOf(id);
      if (togIdx === -1) {
        setItem('toggled', [...togList, id]);
      } else {
        togList.splice(togIdx, 1);
        setItem('toggled', togList);
      }
      docList.render();
    },
    onTrash: (xPos, yPos) => {
      $trash.setPos(xPos, yPos);
      $trash.render();
      /*
      trash state
      {
        id : {
          titld,
          content, 
          parent
        }
      }
      */
      // const $trash = new Trash({
      //   $target: $target,
      //   initialState: {},
      //   xPos: xPos,
      //   yPos: yPos,
      // });
    },
  });

  let timer = null;

  let isToggled = false;

  const editor = new Editor({
    $target,
    initialState: {
      id: null,
      title: '',
      content: '',
    },
    onHide: (e) => {
      const $list = $target.querySelector('#list');
      if (isToggled) {
        $list.style.marginLeft = '0px';
        e.target.textContent = '<<';
        isToggled = !isToggled;
      } else {
        e.target.textContent = '>>';
        //$list.style.display = 'none';
        $list.style.marginLeft = '-265px';
        const $trashList = $target.querySelector('#trash-list');
        if ($trashList) $target.removeChild($trashList);
        isToggled = !isToggled;
      }
    },
    onEditing: (doc) => {
      const { id, title, content } = doc;
      const isEmptyString = (string) => string === '';
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(async () => {
        const { pathname } = window.location;
        if (pathname === '/') {
          const createdDoc = await request(`/documents`, {
            method: 'POST',
            body: JSON.stringify({
              title: isEmptyString(title) ? '제목 없음' : title,
              parent: id,
            }),
          });
          if (!isEmptyString(content)) {
            await request(`/documents/${createdDoc.id}`, {
              method: 'PUT',
              body: JSON.stringify({
                title: isEmptyString(title) ? '제목 없음' : title,
                content: content,
              }),
            });
          }
          history.replaceState(null, null, `/documents/${createdDoc.id}`);
          editor.setState({ ...createdDoc, content: content });
          fetchList();
          //push(`/documents/${createdDoc.id}`);
        } else {
          await request(`/documents/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
              title: isEmptyString(title) ? '제목 없음' : title,
              content: content,
            }),
          });
          const favList = getItem('favorites', {});
          if (favList[id]) {
            favList[id] = title;
            setItem('favorites', { ...favList });
          }
          //push(`/documents/${id}`);
          fetchList();
        }
      }, 1000);
    },
    onRemove: async (doc) => {
      console.log(doc);
      const docLi = document.querySelector(`li[data-id="${doc.id}"]`);
      const { parent } = docLi.dataset;
      const { title, content } = doc;
      $trash.setState({
        ...$trash.state,
        [doc.id]: {
          parent: parent,
          title: title,
          content: content,
        },
      });
      $trash.render();
      const favList = getItem('favorites', {});
      const toggled = getItem('toggled', []);
      const { id } = doc;
      const togIdx = toggled.indexOf(id);
      if (togIdx !== -1) {
        toggled.splice(togIdx, 1);
        setItem('toggled', toggled);
      }
      if (favList[id]) {
        delete favList[id];
        setItem('favorites', favList);
      }
      if (id !== null) {
        await request(`/documents/${id}`, {
          method: 'DELETE',
        });
        history.replaceState(null, null, `/`);
        editor.setState({
          id: null,
          title: '',
          content: '',
        });
        fetchList();
      }
    },
    onFav: async (doc) => {
      const { id, title } = doc;
      setFav(id, title);
    },
    onChild: (id) => {
      push(`/documents/${id}`);
    },
  });

  const setFav = (id, title) => {
    console.log(title);
    const favList = getItem('favorites', {});
    if (favList[id] === undefined) {
      setItem('favorites', { ...favList, [id]: title });
    } else {
      console.log(favList[id]);
      delete favList[id];
      setItem('favorites', favList);
    }
    fetchList();
  };

  const fetchList = async () => {
    const docs = await request(`/documents`, {
      method: 'GET',
    });
    if (docs) {
      docList.setState(docs);
    }
  };

  const fetchDoc = async (id) => {
    const doc = await request(`/documents/${id}`, {
      method: 'GET',
    });
    console.log('fetchedDoc', doc);
    if (doc === undefined) {
      history.replaceState(null, null, `/`);
      editor.setState({
        id: null,
        title: '',
        content: '',
      });
    } else if (doc) {
      editor.setState({
        id: id,
        ...doc,
      });
      //push(`/documents/${id}`);
      //history.pushState(null, null, `/documents/${id}`);
    }
  };

  window.addEventListener('popstate', (e) => {
    console.log('back');
    this.route();
  });

  this.route = async () => {
    const { pathname } = window.location;
    console.log('routing');
    await fetchList();
    if (pathname === '/') {
      editor.setState({
        id: null,
        title: '',
        content: '',
      });
    } else if (pathname.indexOf('/documents/') === 0) {
      const [, , id] = pathname.split('/');
      fetchDoc(id);
    }
  };

  this.route();

  initRouter(() => this.route());
}
