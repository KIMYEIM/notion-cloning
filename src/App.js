import DocList from './DocList.js';
import Editor from './Editor.js';
import { request } from './api.js';
import { initRouter, push } from './router.js';
import { getItem, setItem } from './storage.js';

export default function App({ $target }) {
  const docList = new DocList({
    $target,
    initialState: [],
    onClick: ($li) => {
      if ($li.tagName === 'H4') {
        push('/');
      } else {
        const { id } = $li.dataset;
        fetchDoc(id);
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
  });

  let timer = null;

  const editor = new Editor({
    $target,
    initialState: {
      id: null,
      title: '',
      content: '',
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
          push(`/documents/${createdDoc.id}`);
          //editor.setState({ ...createdDoc, content: '' });*/
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
          push(`/documents/${id}`);
        }
      }, 2000);
    },
    onRemove: async (doc) => {
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
        push(`/`);
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
    if (doc) {
      editor.setState({
        id: id,
        ...doc,
      });
      //push(`/documents/${id}`);
      history.pushState(null, null, `/documents/${id}`);
    }
  };

  window.addEventListener('popstate', (e) => {
    this.route();
  });

  this.route = async () => {
    const { pathname } = window.location;
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
