const SERVER_URL = 'https://crm-backend-3vdv.onrender.com/users';
let clientsList = [];

async function serverGetClients() {
  let response = await fetch(SERVER_URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  let data = await response.json();
  return data;
}

async function serverAddClient(obj) {
  let response = await fetch(SERVER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  })

  let data = await response.json();
  return data;
}

async function serverDeleteClient(obj) {
  let response = await fetch(SERVER_URL + `/${obj.id}`, {
    method: 'DELETE',
  })

  let data = await response.json();
  return data;
}

async function serverEditClient(obj) {
  let response = await fetch(SERVER_URL + `/${obj.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  })

  let data = await response.json();
  return data;
}

showLoader();
let serverData = await serverGetClients();

if(serverData !== null) {
  clientsList = serverData;
}

sort(clientsList, 'id');

hideLoader();
renderTable(clientsList);

document.getElementById('search-input').addEventListener('input', (event) => {
  event.preventDefault();
  setTimeout(function() {
    renderTable(clientsList);
  }, 300);
})

/* helpers */
function formatDate(date) {
  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  let yy = date.getFullYear();

  return dd + '.' + mm + '.' + yy;
}

function getTime(date) {
  let hour = date.getHours();
  if (hour < 10) hour = '0' + hour;

  let min = date.getMinutes();
  if (min < 10) min = '0' + min;

  return ' ' + hour + ':' + min;
}

function createPopper(obj) {
  const $contactPopper = document.createElement('div');
  $contactPopper.textContent = obj.type + ': ' + obj.value;

  $contactPopper.classList.add('contact-popper');
  return $contactPopper;
}

function closeModal() {
  const inputs = document.querySelectorAll('.add-input');

  for(let input of inputs){
    const parent = input.parentNode;
    if(parent.classList.contains('error')) {
      parent.querySelector('.error-label').remove();
      parent.classList.remove('error');
    }
  }

  let contactWraps = document.querySelectorAll('.contact-wrap');
  for(let contactWrap of contactWraps) {
    contactWrap.remove();
  }

  document.getElementById('btn-contact').classList.remove('hidden');
  document.getElementById('add-form').reset();
  document.getElementById('add-wrap').classList.remove('add-wrap--active');
}

function addContact(contactObj = {}) {
  const $contactWrap = document.createElement('div');
  const $contactType = document.createElement('select');
  const $contactInput = document.createElement('input');
  const $contactDelete = document.createElement('button');
  const $contactDeletePopper = document.createElement('div');

  $contactWrap.classList.add('contact-wrap');
  $contactType.classList.add('contact-type');
  $contactInput.classList.add('contact-input');
  $contactDelete.classList.add('contact-delete');
  $contactDeletePopper.classList.add('contact-delete-popper');

  const $optionTel = document.createElement('option');
  const $optionAddTel = document.createElement('option');
  const $optionEmail = document.createElement('option');
  const $optionTelegram = document.createElement('option');
  const $optionFb = document.createElement('option');

  $optionTel.textContent = 'Phone';
  $optionAddTel.textContent = 'Add. telephone';
  $optionEmail.textContent = 'Email';
  $optionTelegram.textContent = 'Telegram';
  $optionFb.textContent = 'Facebook';
  $contactDeletePopper.textContent = 'Delete contacts';
  $contactInput.placeholder = 'Enter contact details';
  $contactDelete.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/> </svg>';

  $contactDelete.append($contactDeletePopper);
  $contactType.append($optionTel, $optionAddTel, $optionEmail, $optionTelegram, $optionFb);
  $contactWrap.append($contactType, $contactInput, $contactDelete);
  $contactInput.type = 'tel';

  $contactType.addEventListener('change', () => {
    if($contactType.value === 'Phone' || $contactType.value === 'Add. phone') {
      $contactInput.type = 'tel'
    } else if($contactType.value === 'Email') {
      $contactInput.type = 'email';
    } else {
      $contactInput.type = 'text';
    }
  })

  if(Object.keys(contactObj).length !== 0) {
    let options = $contactType.getElementsByTagName('option');

    if(contactObj.type === 'Phone' || contactObj.type === 'Add. telephone') {
      $contactInput.type = 'tel';
    } else if(contactObj.type === 'Email') {
      $contactInput.type = 'email';
    } else {
      $contactInput.type = 'text';
    }

    for(let option of options) {
      if(option.textContent === contactObj.type) {
        option.selected = 'selected';
      }
    }

    $contactInput.value = contactObj.value;
  }

  const choices = new Choices($contactType, {
    searchEnabled: false,
    itemSelectText: '',
    shouldSort: false,
    position: 'bottom'
  });

  $contactDelete.addEventListener('click', () => {
    $contactWrap.remove();
    if(document.querySelector('.btn-contact-edit')) {
      document.querySelector('.btn-contact-edit').classList.remove('hidden');
    }
    document.getElementById('btn-contact').classList.remove('hidden');
  });

  return $contactWrap;
}

function contactController(modalClass) {
  let count = 0;
  let contactWraps = document.querySelector(modalClass).querySelectorAll('.contact-wrap');

  for(let contactWrap of contactWraps) {
    count++;
  }

  if(count >= 10) {
    document.querySelector(modalClass).querySelector('.btn-contact').classList.add('hidden');
  }
}

function showLoader() {
  document.querySelector('.tbody').classList.add('preloader-open');
  document.querySelector('.preloader').classList.add('show');
}

function hideLoader() {
  document.querySelector('.tbody').classList.remove('preloader-open');
  document.querySelector('.preloader').classList.remove('show');
}

/* table rendering */
function $getNewClientTR(clientObj) {
  let $tr = document.createElement('tr');
  let $tdId = document.createElement('td');
  let $tdFio = document.createElement('td');
  let $tdCreate = document.createElement('td');
  let $tdUpdate = document.createElement('td');
  let $tdContacts = document.createElement('td');
  let $tdButtons = document.createElement('td');

  let $btnEdit = document.createElement('button');
  let $btnDelete = document.createElement('button');
  let $CreateTime = document.createElement('span');
  let $UpdateTime = document.createElement('span');
  let $ContactsWrap = document.createElement('div');
  let $ButtonsWrap = document.createElement('div');

  $tdId.classList.add('td', 'td-id');
  $tdFio.classList.add('td', 'td-fio');
  $tdCreate.classList.add('td', 'td-create');
  $tdUpdate.classList.add('td', 'td-update');
  $tdButtons.classList.add('td-buttons');
  $ContactsWrap.classList.add('contacts-wrap');
  $ButtonsWrap.classList.add('buttons-wrap');
  $CreateTime.classList.add('date-time');
  $UpdateTime.classList.add('date-time');

  $tdId.textContent = clientObj.id;
  $tdFio.textContent = `${clientObj.name} ${clientObj.surname}`
  $tdCreate.textContent = formatDate(new Date(clientObj.createdAt));
  $tdUpdate.textContent = formatDate(new Date(clientObj.updatedAt));
  $CreateTime.textContent = getTime(new Date(clientObj.createdAt));
  $UpdateTime.textContent = getTime(new Date(clientObj.updatedAt));

  $btnEdit.classList.add('btn', 'btn-edit');
  $btnEdit.textContent = 'Edit';
  $btnEdit.addEventListener('click', () => {
    editClient(clientObj);
  });

  $btnDelete.classList.add('btn', 'btn-delete');
  $btnDelete.textContent = 'Delete';
  $btnDelete.addEventListener('click', () => {
    deleteClient(clientObj);
  });

  if(clientObj.contacts) {
    for(let i = 0; i < clientObj.contacts.length; i++) {
      let $contactContent = document.createElement('div');
      let $contact = document.createElement('div');
      $contactContent.classList.add('contact-content');

      $contact.classList.add('contact');
      $contactContent.append($contact, createPopper(clientObj.contacts[i]));

      if(clientObj.contacts[i].type === 'Phone') {
        $contact.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <g opacity="0.7"> <circle cx="8" cy="8" r="8" fill="#9873FF"/> <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/> </g> </svg>';
      } else if (clientObj.contacts[i].type === 'Email') {
        $contact.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/> </svg>';
      } else if (clientObj.contacts[i].type === 'Facebook') {
        $contact.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <g opacity="0.7"> <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/> </g></svg>';
      } else if (clientObj.contacts[i].type === 'Telegram') {
        $contact.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_771_89)"><path d="M16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8ZM8.287 5.906C7.509 6.23 5.953 6.9 3.621 7.916C3.243 8.066 3.044 8.214 3.026 8.358C2.996 8.601 3.301 8.697 3.716 8.828L3.891 8.883C4.299 9.016 4.849 9.171 5.134 9.177C5.394 9.183 5.683 9.077 6.002 8.857C8.181 7.386 9.306 6.643 9.376 6.627C9.426 6.615 9.496 6.601 9.542 6.643C9.589 6.684 9.584 6.763 9.579 6.784C9.549 6.913 8.352 8.025 7.733 8.601C7.54 8.781 7.403 8.908 7.375 8.937C7.31334 9.00001 7.25067 9.06202 7.187 9.123C6.807 9.489 6.523 9.763 7.202 10.211C7.529 10.427 7.791 10.604 8.052 10.782C8.336 10.976 8.62 11.169 8.988 11.411C9.081 11.471 9.171 11.536 9.258 11.598C9.589 11.834 9.888 12.046 10.255 12.012C10.469 11.992 10.69 11.792 10.802 11.192C11.067 9.775 11.588 6.706 11.708 5.441C11.7153 5.33584 11.711 5.2302 11.695 5.126C11.6856 5.04192 11.6449 4.96446 11.581 4.909C11.49 4.84619 11.3815 4.81365 11.271 4.816C10.971 4.821 10.508 4.982 8.287 5.906Z" fill="#9873FF" fill-opacity="0.701961"/></g><defs><clipPath id="clip0_771_89"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>';
      } else {
        $contact.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/> </svg>'
      }

      $ContactsWrap.append($contactContent);
    }
  }

  $tdCreate.append($CreateTime);
  $tdUpdate.append($UpdateTime);
  $tdContacts.append($ContactsWrap);
  $ButtonsWrap.append($btnEdit, $btnDelete);
  $tdButtons.append($ButtonsWrap);
  $tr.append($tdId, $tdFio, $tdCreate, $tdUpdate, $tdContacts, $tdButtons);

  return $tr;
}

function renderTable(clientsList) {
  let copyArr = [...clientsList];
  const $tBody = document.getElementById('tbody');
  $tBody.innerHTML = '';

  const searchValue = document.getElementById('search-input').value;

  if(searchValue) {
    let result = [];
    for (const item of copyArr) {
      if (String(`${item.name} ${item.surname}`).toLocaleLowerCase().includes(searchValue.toLowerCase())) result.push(item);
    }
    copyArr = result;
  }

  for(let clientObj of copyArr) {
    $tBody.append($getNewClientTR(clientObj));
  }
}

/* new client addition */
document.getElementById('btn-add').addEventListener('click', () => {
  document.getElementById('add-wrap').classList.add('add-wrap--active');
});

document.getElementById('btn-close').addEventListener('click', () => closeModal());

document.getElementById('btn-cancel').addEventListener('click', () => closeModal());

document.getElementById('btn-contact').addEventListener('click', () => {
  document.getElementById('contact-new').insertBefore(addContact(), document.getElementById('btn-contact'));
  contactController('.modal-content');
});

document.getElementById('add-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  let contactList = [];

  const contactTypes = document.querySelectorAll('.contact-type');
  const contactInputs = document.querySelectorAll('.contact-input');

  for(let i = 0; i < contactTypes.length; i++) {
    if(contactInputs[i].value) {
      contactList.push({
        type: contactTypes[i].options[contactTypes[i].selectedIndex].value,
        value: contactInputs[i].value.trim()
      })
    }
  }

  if(validation('add-form')) {
    showLoader();
    let newClientObj = {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: document.getElementById('name-input').value.trim(),
      surname: document.getElementById('surname-input').value.trim(),
      contacts: contactList,
    }

    let serverDataObj = await serverAddClient(newClientObj);
    clientsList.push(serverDataObj);

    hideLoader();
    renderTable(clientsList);
    closeModal();
    contactList = [];
  }
})

/* clientList editing */
function editClient(clientObj) {
  let $editWrap = document.createElement('div');
  let $editContent = document.createElement('div');
  let $editTop = document.createElement('div');
  let $editTitle = document.createElement('h2');
  let $editId = document.createElement('p');
  let $clientId = document.createElement('span');
  let $editForm = document.createElement('form');
  let $editLabelSurname = document.createElement('label');
  let $editInputSurname = document.createElement('input');
  let $editLabelName = document.createElement('label');
  let $editInputName = document.createElement('input');
  let $contactNew = document.createElement('div');
  let $btnContact = document.createElement('button');
  let $btnSave = document.createElement('button');
  let $btnDelete = document.createElement('button');
  let $btnClose = document.createElement('button');

  $editTitle.textContent = 'Change data';
  $editId.textContent = 'ID:';
  $clientId.textContent = clientObj.id;
  $editLabelName.textContent = 'Name*';
  $editInputName.value = clientObj.name;
  $editLabelSurname.textContent = 'Surname*';
  $editInputSurname.value = clientObj.surname;

  $btnContact.textContent = 'Add a contact';
  $btnSave.textContent = 'Save';
  $btnDelete.textContent = 'Delete client';

  $editWrap.classList.add('modal-wrap', 'edit-wrap--active', 'modal-edit');
  $editContent.classList.add('modal-content');
  $editTop.classList.add('edit-top');
  $editTitle.classList.add('edit-title');
  $editId.classList.add('edit-id');
  $clientId.classList.add('client-id');
  $editForm.classList.add('edit-form');
  $editForm.id = 'edit-form';
  $editLabelName.classList.add('edit-label');
  $editInputName.classList.add('edit-input');
  $editLabelSurname.classList.add('edit-label');
  $editInputSurname.classList.add('edit-input');
  $contactNew.classList.add('contact-new');
  $btnContact.classList.add('btn', 'btn-contact', 'btn-contact-edit');
  $btnContact.type = 'button';
  $btnSave.classList.add('btn-save', 'btn--primary');
  $btnDelete.classList.add('btn', 'btn-delete-edit', 'btn--cancel');
  $btnClose.classList.add('btn', 'btn-close');

  $editId.append($clientId);
  $editTop.append($editTitle, $editId);
  $editLabelName.append($editInputName);
  $editLabelSurname.append($editInputSurname);
  $contactNew.append($btnContact)
  $editForm.append($editLabelName, $editLabelSurname, $contactNew, $btnSave);
  $editContent.append($editTop, $editForm, $btnDelete, $btnClose);
  $editWrap.append($editContent);
  document.body.append($editWrap);

  $btnContact.addEventListener('click', () => {
    $contactNew.insertBefore(addContact(), $btnContact);
    contactController('.modal-edit');
  });

  for(let i = 0; i < clientObj.contacts.length; i++) {
    $contactNew.prepend(addContact(clientObj.contacts[i]));
    if(i === 9) {
      $btnContact.classList.add('hidden');
    }
  }

  let contactList = [];

  $editForm.addEventListener('submit', async (e)=> {
    e.preventDefault();

    const contactTypes = $contactNew.querySelectorAll('.contact-type');
    const contactInputs = $contactNew.querySelectorAll('.contact-input');

    for(let i = 0; i < contactTypes.length; i++) {
      if(contactInputs[i].value) {
        contactList.push({
          type: contactTypes[i].options[contactTypes[i].selectedIndex].value,
          value: contactInputs[i].value.trim()
        })
      }
    }

    if(validation('edit-form')) {
      showLoader();
      clientObj.updatedAt = new Date();
      clientObj.name = $editInputName.value.trim();
      clientObj.surname = $editInputSurname.value.trim();
      clientObj.contacts = contactList;
      document.body.removeChild($editWrap);

      await serverEditClient(clientObj);

      hideLoader();
      renderTable(clientsList);
      contactList = [];
    }
  })

  $btnDelete.addEventListener('click', () => {
    document.body.removeChild($editWrap);
    deleteClient(clientObj);
  })

  $btnClose.addEventListener('click', () => {
    document.body.removeChild($editWrap);
  })
}

function deleteClient(clientObj) {
  let $deleteWrap = document.createElement('div');
  let $deleteContent = document.createElement('div');
  let $deleteTitle = document.createElement('h2');
  let $deleteDescr = document.createElement('p');
  let $btnRemove = document.createElement('button');
  let $btnLeave = document.createElement('button');
  let $btnClose = document.createElement('button');

  $deleteTitle.textContent = 'Delete client';
  $deleteDescr.textContent = 'Do you want to delete this client?';
  $btnRemove.textContent = 'Delete';
  $btnLeave.textContent = 'Cancel';

  $deleteWrap.classList.add('modal-wrap', 'delete-wrap--active');
  $deleteContent.classList.add('modal-content', 'delete__content');
  $deleteTitle.classList.add('delete__title');
  $deleteDescr.classList.add('delete__descr');
  $btnRemove.classList.add('btn-remove', 'btn--primary');
  $btnLeave.classList.add('btn', 'btn-leave', 'btn--cancel');
  $btnClose.classList.add('btn', 'btn-close');

  $deleteContent.append($deleteTitle, $deleteDescr, $btnRemove, $btnLeave, $btnClose);
  $deleteWrap.append($deleteContent);
  document.body.append($deleteWrap);

  $btnRemove.addEventListener('click', async (e) => {
    e.preventDefault();
    showLoader();
    await serverDeleteClient(clientObj);
    $deleteWrap.classList.remove('delete-wrap--active');

    hideLoader();
    location.reload(true);
  })

  $btnLeave.addEventListener('click', () => {
    $deleteWrap.classList.remove('delete-wrap--active');
  })

  $btnClose.addEventListener('click', () => {
    $deleteWrap.classList.remove('delete-wrap--active');
  })
}

/* sorting */
function sort(array, property, direction = true) {
  return array.sort((a, b) => {
      if (direction ? a[property] < b[property] : a[property] > b[property]) return -1;
  })
}

let thList = document.querySelectorAll('.th');

for(let th of thList) {
  th.addEventListener('click', () => {
    if(th.classList.contains('th-fio')) {
      if(th.classList.contains('th-clicked')){
        th.classList.remove('th-clicked');
        clientsList.sort((a, b) => {
          if(a['name'] + ' ' + a['surname'] > b['name'] + ' ' + b['surname']) return -1;
        })
      } else {
        th.classList.add('th-clicked');
        clientsList.sort((a, b) => {
          if(a['name'] + ' ' + a['surname'] < b['name'] + ' ' + b['surname']) return -1;
        })
      }
    } else if(th.classList.contains('th-id')) {
      if(th.classList.contains('th-clicked')){
        th.classList.remove('th-clicked');
        sort(clientsList, 'id', false);
      } else {
        th.classList.add('th-clicked');
        sort(clientsList, 'id');
      }
    } else if(th.classList.contains('th-create')) {
      if(th.classList.contains('th-clicked')){
        th.classList.remove('th-clicked');
        sort(clientsList, 'createdAt', false);
      } else {
        th.classList.add('th-clicked');
        sort(clientsList,'createdAt');
      }
    } else if(th.classList.contains('th-update')){
      if(th.classList.contains('th-clicked')){
        th.classList.remove('th-clicked');
        sort(clientsList, 'updatedAt', false);
      } else {
        th.classList.add('th-clicked');
        sort(clientsList, 'updatedAt');
      }
    }

    renderTable(clientsList);
  });
}

/* validation */
function removeError(input) {
  const parent = input.parentNode;
  if(parent.classList.contains('error')) {
    parent.querySelector('.error-label').remove();
    parent.classList.remove('error');
  }
}

function createError(input, text) {
  const parent = input.parentNode;
  if(!parent.classList.contains('error')) {
    const errorLable = document.createElement('label');

    errorLable.classList.add('error-label');
    errorLable.textContent = text;

    parent.classList.add('error');
    parent.append(errorLable);
  }
}

function validation(formId) {
  let result = true;
  const inputs = document.getElementById(formId).querySelectorAll('.add-input, .edit-input');

  for(const input of inputs) {
    removeError(input);
    if(!input.value.trim()) {
      removeError(input);
      createError(input, 'Fill in the field');
    }

    if(input.value.trim() && /^[a-zA-Zа-яА-Я]+$/i.test(input.value.trim()) === false){
      createError(input, 'Invalid format');
    }
  }

  for(const input of inputs) {
    input.addEventListener('input', function(){
      if(input.parentNode.classList.contains('error')) {
      removeError(input);
    }
    });
  }

  for(const input of inputs) {
    if(input.parentNode.classList.contains('error')) {
      result = false;
    }
  }

  return result;
}
