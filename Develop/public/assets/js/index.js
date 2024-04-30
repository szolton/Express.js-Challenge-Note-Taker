let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let clearBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelector('.list-group');
}

const show = (elem) => {
  elem.style.display = 'inline';
};

const hide = (elem) => {
  elem.style.display = 'none';
};

let activeNote = {};

const getNotes = () =>
  fetch('http://localhost:3000/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const saveNote = (note) =>
  fetch('http://localhost:3000/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  })
  .then(response => {
    if (response.status === 200 || response.status === 201) {
      console.log('Note saved successfully');
    } else {
      throw new Error('Failed to save note');
    }
  })
  .catch(error => {
    console.error('Failed to save note:', error);
    throw error; // Rethrow the error to propagate it further
  });



const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);
  hide(clearBtn);

  if (activeNote.id) {
    show(newNoteBtn);
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    hide(newNoteBtn);
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value
  };
  saveNote(newNote)
    .then(() => {
      getAndRenderNotes();
      renderActiveNote();
    })
    .catch(error => {
      console.error('Failed to save note:', error);
    });
};

const handleNoteDelete = (e) => {
  e.stopPropagation();
  const noteId = JSON.parse(e.target.closest('li').getAttribute('data-note')).id;
  if (!noteId) {
    console.error('Note id is undefined');
    return;
  }

  // Check if the note exists in your data
  const noteExists = notes.some(note => note.id === noteId);
  if (!noteExists) {
    console.error('Note with id', noteId, 'does not exist');
    return;
  }

  if (activeNote.id === noteId) {
    activeNote = {};
  }
  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};


const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

const handleNewNoteView = (e) => {
  activeNote = {};
  show(clearBtn);
  renderActiveNote();
};

const handleRenderBtns = () => {
  show(clearBtn);
  if (!noteTitle.value.trim() && !noteText.value.trim()) {
    hide(clearBtn);
  } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

const renderNoteList = async (notes) => {
  if (!notes) return;
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.innerHTML = '';
  }

  let noteListItems = [];

  const createLi = (text, id, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');
    liEl.id = id;

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title, note.id);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList.append(note));
  }
};

const getAndRenderNotes = () => {
  getNotes()
    .then(renderNoteList)
    .catch((error) => {
      console.error('Failed to fetch notes:', error);
    });
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/notes') {
    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', handleNewNoteView);
    clearBtn.addEventListener('click', renderActiveNote);
    noteForm.addEventListener('input', handleRenderBtns);
  }

  getAndRenderNotes();
});
