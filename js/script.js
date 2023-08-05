const SERVER_URL = 'https://distinct-gray-shoe.cyclic.app/users';
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
  const $optionVk = document.createElement('option');
  const $optionFb = document.createElement('option');

  $optionTel.textContent = 'Телефон';
  $optionAddTel.textContent = 'Доп. телефон';
  $optionEmail.textContent = 'Email';
  $optionVk.textContent = 'Vk';
  $optionFb.textContent = 'Facebook';
  $contactDeletePopper.textContent = 'Удалить контакт';
  $contactInput.placeholder = 'Введите данные контакта';
  $contactDelete.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/> </svg>';

  $contactDelete.append($contactDeletePopper);
  $contactType.append($optionTel, $optionAddTel, $optionEmail, $optionVk, $optionFb);
  $contactWrap.append($contactType, $contactInput, $contactDelete);
  $contactInput.type = 'tel';

  $contactType.addEventListener('change', () => {
    if($contactType.value === 'Телефон' || $contactType.value === 'Доп. телефон') {
      $contactInput.type = 'tel'
    } else if($contactType.value === 'Email') {
      $contactInput.type = 'email';
    } else {
      $contactInput.type = 'text';
    }
  })

  if(Object.keys(contactObj).length !== 0) {
    let options = $contactType.getElementsByTagName('option');

    if(contactObj.type === 'Телефон' || contactObj.type === 'Доп. телефон') {
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
  $tdFio.textContent = `${clientObj.surname} ${clientObj.name} ${clientObj.lastName}`
  $tdCreate.textContent = formatDate(new Date(clientObj.createdAt));
  $tdUpdate.textContent = formatDate(new Date(clientObj.updatedAt));
  $CreateTime.textContent = getTime(new Date(clientObj.createdAt));
  $UpdateTime.textContent = getTime(new Date(clientObj.updatedAt));

  $btnEdit.classList.add('btn', 'btn-edit');
  $btnEdit.textContent = 'Изменить';
  $btnEdit.addEventListener('click', () => {
    editClient(clientObj);
  });

  $btnDelete.classList.add('btn', 'btn-delete');
  $btnDelete.textContent = 'Удалить';
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

      if(clientObj.contacts[i].type === 'Телефон') {
        $contact.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <g opacity="0.7"> <circle cx="8" cy="8" r="8" fill="#9873FF"/> <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/> </g> </svg>';
      } else if (clientObj.contacts[i].type === 'Email') {
        $contact.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/> </svg>';
      } else if (clientObj.contacts[i].type === 'Facebook') {
        $contact.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <g opacity="0.7"> <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/> </g></svg>';
      } else if (clientObj.contacts[i].type === 'Vk') {
        $contact.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <g opacity="0.7"><path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/></g></svg>';
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
      if (String(`${item.surname} ${item.name} ${item.lastName}`).toLocaleLowerCase().includes(searchValue.toLowerCase())) result.push(item);
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
      lastName: document.getElementById('lastname-input').value.trim(),
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
  let $editLabelLastname = document.createElement('label');
  let $editInputLastname = document.createElement('input');
  let $contactNew = document.createElement('div');
  let $btnContact = document.createElement('button');
  let $btnSave = document.createElement('button');
  let $btnDelete = document.createElement('button');
  let $btnClose = document.createElement('button');

  $editTitle.textContent = 'Изменить данные';
  $editId.textContent = 'ID:';
  $clientId.textContent = clientObj.id;
  $editLabelSurname.textContent = 'Фамилия*';
  $editInputSurname.value = clientObj.surname;
  $editLabelName.textContent = 'Имя*';
  $editInputName.value = clientObj.name;
  $editLabelLastname.textContent = 'Отчество';
  $editInputLastname.value = clientObj.lastName;

  $btnContact.textContent = 'Добавить контакт';
  $btnSave.textContent = 'Сохранить';
  $btnDelete.textContent = 'Удалить клиента';

  $editWrap.classList.add('modal-wrap', 'edit-wrap--active', 'modal-edit');
  $editContent.classList.add('modal-content');
  $editTop.classList.add('edit-top');
  $editTitle.classList.add('edit-title');
  $editId.classList.add('edit-id');
  $clientId.classList.add('client-id');
  $editForm.classList.add('edit-form');
  $editForm.id = 'edit-form';
  $editLabelSurname.classList.add('edit-label');
  $editInputSurname.classList.add('edit-input');
  $editLabelName.classList.add('edit-label');
  $editInputName.classList.add('edit-input');
  $editLabelLastname.classList.add('edit-label');
  $editInputLastname.classList.add('edit-input');
  $editInputLastname.id = 'lastname-input';
  $contactNew.classList.add('contact-new');
  $btnContact.classList.add('btn', 'btn-contact', 'btn-contact-edit');
  $btnContact.type = 'button';
  $btnSave.classList.add('btn-save', 'btn--primary');
  $btnDelete.classList.add('btn', 'btn-delete-edit', 'btn--cancel');
  $btnClose.classList.add('btn', 'btn-close');

  $editId.append($clientId);
  $editTop.append($editTitle, $editId);
  $editLabelSurname.append($editInputSurname);
  $editLabelName.append($editInputName);
  $editLabelLastname.append($editInputLastname);
  $contactNew.append($btnContact)
  $editForm.append($editLabelSurname, $editLabelName, $editLabelLastname, $contactNew, $btnSave);
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
      clientObj.surname = $editInputSurname.value.trim();
      clientObj.name = $editInputName.value.trim();
      clientObj.lastName = $editInputLastname.value.trim();
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

  $deleteTitle.textContent = 'Удалить клиента';
  $deleteDescr.textContent = 'Вы действительно хотите удалить данного клиента?';
  $btnRemove.textContent = 'Удалить';
  $btnLeave.textContent = 'Отмена';

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
          if(a['surname'] + ' ' + a['name'] + ' ' + a['lastName'] > b['surname'] + ' ' + b['name'] + ' ' + b['lastName']) return -1;
        })
      } else {
        th.classList.add('th-clicked');
        clientsList.sort((a, b) => {
          if(a['surname'] + ' ' + a['name'] + ' ' + a['lastName'] < b['surname'] + ' ' + b['name'] + ' ' + b['lastName']) return -1;
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
    if(!input.value.trim() && input.id !== 'lastname-input') {
      removeError(input);
      createError(input, 'Заполните поле');
    }

    if(input.value.trim() && /^[a-zA-Zа-яА-Я]+$/i.test(input.value.trim()) === false){
      createError(input, 'Недопустимый формат');
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
