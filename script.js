const DELETE_BTN_CLASS = "delete-btn";
const EDIT_BTN_CLASS = "edit-btn";
const CONTACT_ROW_SELECTOR = ".contact-row";
const STORAGE_KEY = "contact";

const contactForm = document.querySelector("#newContactForm");
const contactsListEl = document.querySelector("#contactsList");
const contactTemplate = document.querySelector("#contactTemplate").innerHTML;
const formNameInput = document.querySelector("#nameInput");
const formSurnameInput = document.querySelector("#surnameInput");
const formPhoneInput = document.querySelector("#phoneInput");

contactForm.addEventListener("submit", onContactFormSubmit);
contactsListEl.addEventListener("click", onContactsListClick);

let contactsList = [];

init();

function onContactFormSubmit(e) {
  e.preventDefault();

  const newContact = getContact();

  if (isContactValid(newContact)) {
    addContact(newContact);
    resetForm();
  } else {
    alert("Not valid");
  }
}

function onContactsListClick(e) {
  if (e.target.classList.contains(DELETE_BTN_CLASS)) {
    const id = getContactId(e.target);
    removeContact(id);
  }
}

function init() {
  contactsList = restoreData();
  renderList();
}

function getContact() {
  return {
    name: getNameContact(),
    surname: getSurnameContact(),
    phone: getPhoneContact(),
  };
}

function getNameContact() {
  return formNameInput.value;
}
function getSurnameContact() {
  return formSurnameInput.value;
}
function getPhoneContact() {
  return formPhoneInput.value;
}

function isContactValid(contact) {
  return (
    isTextFieldValid(contact.name) &&
    isTextFieldValid(contact.surname) &&
    isPhoneFieldValid(contact.phone)
  );
}

function isTextFieldValid(value) {
  return value !== "";
}

function isPhoneFieldValid(value) {
  return isTextFieldValid(value) && !isNaN(value);
}

function generateContactHtml(contact) {
  return interpolate(contactTemplate, contact);
}

function interpolate(template, obj) {
  for (key in obj) {
    template = template.replaceAll(`{{${key}}}`, obj[key]);
  }

  return template;
}

function addContact(contact) {
  contact.id = Date.now();
  contactsList.push(contact);

  renderList();
}

function renderList() {
  saveData();

  contactsListEl.innerHTML = contactsList.map(generateContactHtml).join("\n");
}

function resetForm() {
  contactForm.reset();
}

function getContactId(el) {
  const contactRowEl = el.closest(CONTACT_ROW_SELECTOR);

  return +contactRowEl.dataset.contactId;
}

function removeContact(id) {
  contactsList = contactsList.filter((obj) => obj.id !== id);
  saveData();
  renderList();
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contactsList));
}

function restoreData() {
  const data = localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : [];
}
