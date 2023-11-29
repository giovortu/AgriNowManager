document.addEventListener('DOMContentLoaded', function() {
    M.Modal.init(document.getElementById('addForm'));
    M.Modal.init(document.getElementById('editForm'));
    M.Modal.init(document.getElementById('confirmDeleteModal'));

    const newDeviceForm = document.getElementById('newDeviceForm');
    const newDeviceBtn = document.getElementById('newDeviceBtn');

    newDeviceForm.addEventListener('input', function () {
    console.log("newDeviceForm" )
      // Check if the form is valid
      const isValid = newDeviceForm.checkValidity();

      // Enable or disable the "Save" button based on form validity
      newDeviceBtn.disabled = !isValid;
    });

    const editDeviceForm = document.getElementById('editDeviceForm');
    const editDeviceBtn = document.getElementById('editDeviceBtn');

    editDeviceForm.addEventListener('input', function () {
    console.log("editDeviceForm" )
      // Check if the form is valid
      const isValid = editDeviceForm.checkValidity();

      // Enable or disable the "Save" button based on form validity
      editDeviceBtn.disabled = !isValid;
    });

  });

  function showDeleteConfirmation(id) {
    const confirmDeleteModal = M.Modal.getInstance(document.getElementById('confirmDeleteModal'));
    const confirmButton = confirmDeleteModal.el.querySelector('.confirm-delete-btn');

    confirmButton.onclick = function () {
      deleteDevice(id);
      confirmDeleteModal.close();
    };

    confirmDeleteModal.open();
  }

  function addDevice() {

    input = document.getElementById('id')
    input.value = ""

    input = document.getElementById('topic')
    input.value = ""

    input = document.getElementById('name')
    input.value = ""

    M.updateTextFields();

    M.Modal.getInstance(document.getElementById('addForm')).open();
  }

  function editDevice(id, topic, name) {

    console.log( id, topic, name )

    input = document.getElementById('editid')
    input.value = id

    input = document.getElementById('edittopic')
    input.value = topic

    input = document.getElementById('editname')
    input.value = name


    input = document.getElementById('origid')
    input.value = id

    M.updateTextFields();

    const editDeviceForm = document.getElementById('editDeviceForm');
    const editDeviceBtn = document.getElementById('editDeviceBtn');

    const isValid = editDeviceForm.checkValidity();
    editDeviceBtn.disabled = !isValid;


    M.Modal.getInstance(document.getElementById('editForm')).open();

  }

  function deleteDevice(id) {
    // Implement delete logic here
    const deleteForm = document.createElement('form');
    deleteForm.setAttribute('action', '/remove');
    deleteForm.setAttribute('method', 'post');

    const idInput = document.createElement('input');
    idInput.setAttribute('type', 'text');
    idInput.setAttribute('name', 'id');
    idInput.value = id;
    idInput.style.display = 'none';
    deleteForm.appendChild(idInput);

    document.body.appendChild(deleteForm);
    deleteForm.submit();
  }

  function downloadConfiguration()
  {

  }
