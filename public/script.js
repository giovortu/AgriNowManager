
let settingsData = {};

document.addEventListener('DOMContentLoaded', function() {
    M.Modal.init(document.getElementById('addForm'));
    M.Modal.init(document.getElementById('editForm'));
    M.Modal.init(document.getElementById('confirmDeleteModal'));

    M.Modal.init(document.getElementById('aboutForm'));
    M.Modal.init(document.getElementById('settingsForm'));

    M.Modal.init(document.getElementById('resultPopup'));
    

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


    const saveSettingsForm= document.getElementById('saveSettingsForm');
    const saveSettingsBtn= document.getElementById('saveSettingsBtn');

    saveSettingsForm.addEventListener('input', function () {
      console.log("saveSettingsBtn" )
        // Check if the form is valid
        const isValid = saveSettingsForm.checkValidity();
  
        // Enable or disable the "Save" button based on form validity
        saveSettingsBtn.disabled = !isValid;
      });

      fetchSettings();

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

  function openPopup()
  {
    M.Modal.getInstance(document.getElementById('aboutForm')).open();
  }


  function openSettings()
  {
    input = document.getElementById('topic_prefix')
    input.value = settingsData.topic_prefix;

    const saveSettingsForm = document.getElementById('saveSettingsForm');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');

    const isValid = saveSettingsForm.checkValidity();
    saveSettingsBtn.disabled = !isValid;

    M.updateTextFields();

    M.Modal.getInstance(document.getElementById('settingsForm')).open();
  }
  async function downloadConfiguration()
  {
  try {
          // Fetch data from the server (replace the URL with your actual server endpoint)
          const response = await fetch('/devices');
          const yamlData = await response.text();

          // Create Blob and download link
          const blob = new Blob([yamlData], { type: 'text/yaml' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'devices.yaml';
  
          // Trigger download
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch (error) {
          console.error('Error fetching or processing data:', error);
        }
    }
  


  document.addEventListener('DOMContentLoaded', function() {
    // Initialize the side navigation (mobile menu)
    const elems = document.querySelectorAll('.sidenav');
    const instances = M.Sidenav.init(elems);
  });

  async function submitSettingsForm() {
    const topicPrefix = document.getElementById('topic_prefix').value;

    try {
      const response = await fetch('/save-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "topic_prefix": topicPrefix }),
      });

      console.log( response );

      if (response.ok) {
        // Show success popup
        document.getElementById('resultPopupText').innerHTML = 'Setting saved!';
      } else {
        // Show error popup
        document.getElementById('resultPopupText').innerHTML = 'Error saving settings!';
      }


    } catch (error) {
      console.error('Error submitting form:', error);
      // Show error popup
      document.getElementById('resultPopupText').innerHTML = 'Error submitting form:'+ error;
    }
    M.Modal.getInstance(document.getElementById('settingsForm')).close();
    M.Modal.getInstance(document.getElementById('resultPopup')).open();
  }


  async function fetchSettings() {
    try {
      const response = await fetch('/get-settings'); // Replace with your server URL
      settingsData = await response.json();

      console.log ( settingsData );


    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }