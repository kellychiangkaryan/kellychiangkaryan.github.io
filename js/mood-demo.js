// Interactive rebuild of the Task and Mood Tracker emoji feature.
// Mirrors the original Ionic modal: five-step mood scale, optional 50-character note,
// Update disabled until a new emoji is picked, and approved tasks are locked.
(function () {
  var root = document.getElementById('mood-demo');
  if (!root) return;

  var MAX_NOTE = 50;
  var moods = [
    { src: 'images/mood-1.png', label: 'Very confident, very happy' },
    { src: 'images/mood-2.png', label: 'Fairly confident, happy' },
    { src: 'images/mood-3.png', label: 'Neutral' },
    { src: 'images/mood-4.png', label: 'Struggling, frustrated' },
    { src: 'images/mood-5.png', label: 'High stress, urgent help' }
  ];

  var tasks = [
    { name: 'Build the login page', status: 'In progress', mood: 1, note: 'Getting the hang of it' },
    { name: 'Fix the task list query', status: 'In progress', mood: 3, note: 'Not sure where the bug is' },
    { name: 'Write test cases', status: 'Approved', mood: 0, note: '' }
  ];

  var table = root.querySelector('.mood-table');
  var editor = document.getElementById('mood-editor');
  var title = document.getElementById('mood-editor-title');
  var options = editor.querySelector('.mood-options');
  var noteInput = document.getElementById('mood-note');
  var count = document.getElementById('mood-count');
  var msg = document.getElementById('mood-msg');
  var updateBtn = document.getElementById('mood-update');
  var cancelBtn = document.getElementById('mood-cancel');

  var editing = -1;   // index of the task being edited
  var picked = -1;    // mood picked in the editor
  var confirming = -1; // index of the task whose note is pending deletion

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function renderTable() {
    table.querySelectorAll('.mood-row:not(.mood-head)').forEach(function (r) { r.remove(); });

    tasks.forEach(function (t, i) {
      var row = el('div', 'mood-row');
      row.setAttribute('role', 'row');

      var name = el('span', 'mood-task');
      name.setAttribute('role', 'cell');
      name.appendChild(el('strong', '', t.name));
      if (t.note) name.appendChild(el('small', '', '“' + t.note + '”'));

      var status = el('span', 'mood-status' + (t.status === 'Approved' ? ' approved' : ''), t.status);
      status.setAttribute('role', 'cell');

      var face = el('span', 'mood-face');
      face.setAttribute('role', 'cell');
      var img = el('img');
      img.src = moods[t.mood].src;
      img.alt = moods[t.mood].label;
      img.title = moods[t.mood].label;
      face.appendChild(img);

      var actions = el('span', 'mood-actions');
      actions.setAttribute('role', 'cell');
      var locked = t.status === 'Approved';

      if (confirming === i) {
        actions.appendChild(el('span', 'mood-confirm', 'Delete note?'));
        var yes = el('button', 'small', 'Delete');
        yes.type = 'button';
        yes.addEventListener('click', function () { t.note = ''; confirming = -1; renderTable(); });
        var no = el('button', 'small off', 'Keep');
        no.type = 'button';
        no.addEventListener('click', function () { confirming = -1; renderTable(); });
        actions.appendChild(yes);
        actions.appendChild(no);
      } else {
        var edit = el('button', 'small', 'Edit emoji');
        edit.type = 'button';
        edit.disabled = locked;
        if (locked) edit.title = 'Approved tasks can no longer be changed';
        edit.addEventListener('click', function () { openEditor(i); });
        actions.appendChild(edit);

        if (t.note && !locked) {
          var del = el('button', 'small off', 'Delete note');
          del.type = 'button';
          del.addEventListener('click', function () { confirming = i; closeEditor(); renderTable(); });
          actions.appendChild(del);
        }
      }

      row.appendChild(name);
      row.appendChild(status);
      row.appendChild(face);
      row.appendChild(actions);
      table.appendChild(row);
    });
  }

  function renderOptions() {
    options.innerHTML = '';
    moods.forEach(function (m, i) {
      var b = el('button', 'mood-option' + (i === picked ? ' selected' : ''));
      b.type = 'button';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', i === picked ? 'true' : 'false');
      var img = el('img');
      img.src = m.src;
      img.alt = '';
      b.appendChild(img);
      b.appendChild(el('span', '', m.label));
      b.addEventListener('click', function () {
        picked = i;
        msg.textContent = '';
        updateBtn.disabled = false; // any new selection enables Update, as in the app
        renderOptions();
      });
      options.appendChild(b);
    });
  }

  function updateCount() {
    var n = noteInput.value.length;
    count.textContent = n + ' / ' + MAX_NOTE;
    var over = n > MAX_NOTE;
    count.classList.toggle('over', over);
    if (over) msg.textContent = 'Max length exceeded. Please enter up to 50 characters.';
    else if (msg.textContent.indexOf('Max length') === 0) msg.textContent = '';
  }

  function openEditor(i) {
    editing = i;
    confirming = -1;
    picked = tasks[i].mood;
    title.textContent = 'Edit emoji: ' + tasks[i].name;
    noteInput.value = tasks[i].note;
    msg.textContent = '';
    updateBtn.disabled = true;
    renderOptions();
    updateCount();
    renderTable();
    editor.hidden = false;
    var first = options.querySelector('.selected') || options.firstChild;
    if (first) first.focus();
  }

  function closeEditor() {
    editing = -1;
    editor.hidden = true;
  }

  noteInput.addEventListener('input', updateCount);

  updateBtn.addEventListener('click', function () {
    if (editing < 0) return;
    if (noteInput.value.length > MAX_NOTE) { updateCount(); return; }
    if (picked === tasks[editing].mood) {
      msg.textContent = 'Please select a new emoji.';
      return;
    }
    tasks[editing].mood = picked;
    tasks[editing].note = noteInput.value.trim();
    closeEditor();
    renderTable();
  });

  cancelBtn.addEventListener('click', function () { closeEditor(); });

  renderTable();
})();
