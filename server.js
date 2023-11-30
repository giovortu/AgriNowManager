const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const ejs = require('ejs');
const path = require('path');

const yaml = require('js-yaml');

const app = express();
const PORT = 3000;
const JSON_FILE_PATH = 'data/devices.json';

app.use('/', express.static(path.join(__dirname, '/public/')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('views', __dirname + '/views'); // Set the views directory


function removeFirstLine(inputString) {
  // Split the string into an array of lines
  const lines = inputString.split('\n');

  // Remove the first line using slice (or splice)
  lines.splice(0, 1);

  // Join the remaining lines to form the new string
  const resultString = lines.join('\n');

  return resultString;
}


app.get('/', async (req, res) => {
  try {
    const devices = await readDevices();

    const devicesPerPage = 5; // Adjust as needed
    const currentPage = parseInt(req.query.page) || 1;
  
    // Assume devices is an array of all devices
    const totalDevices = devices.length;
    const totalPages = Math.ceil(totalDevices / devicesPerPage);
  
    // Calculate the start and end index for the devices on the current page
    const startIdx = (currentPage - 1) * devicesPerPage;
    const endIdx = startIdx + devicesPerPage;
  
    // Slice the devices array to get the devices for the current page
    const devicesOnPage = devices.slice(startIdx, endIdx);
  
    // Calculate startPage and endPage for pagination
    let startPage, endPage;
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }
  
    res.render('index', {
      devices: devicesOnPage,
      currentPage: currentPage,
      totalPages: totalPages,
      startIdx: startIdx,
      endIdx: endIdx,
      startPage: startPage,
      endPage: endPage,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/devices', async (req, res) => {
  
  try {
    const devices = await readDevices();
    

    const settingsData = await fs.readFile(path.join(__dirname, '/data/settings.json'), 'utf-8');
    const settings = JSON.parse(settingsData);

    let prefix = settings.topic_prefix;
    if (!prefix || !prefix.endsWith("/")){
      prefix = prefix + "/";
    } 

    let yamlData = "";

    devices.forEach(device => {     
      
      let array = [];

      obj = {};

      obj.name = "Temperatura " + device.name;
      obj.unique_id = device.id + "_temperature";
      obj.state_topic =  prefix + device.topic;
      obj.unit_of_measurement = "°C";
      obj.device_class = "temperature";
      obj.value_template = "{{ value_json.value }}";

      array.push( obj );
      
      obj = {};

      obj.name = "Suolo " + device.name;
      obj.unique_id = device.id + "_soil_moisture";
      obj.state_topic = prefix + device.topic;
      obj.unit_of_measurement = "%";
      obj.device_class = "moisture";
      obj.value_template = "{{ value_json.value }}";

      array.push( obj );

      obj = {};

      obj.name = "Luminosita " + device.name;
      obj.unique_id = device.id + "_luminosity";
      obj.state_topic = prefix +  device.topic;
      obj.unit_of_measurement = "lumen";
      obj.device_class = "illuminance";
      obj.value_template = "{{ value_json.value }}";

      array.push( obj );

      obj = {};

      obj.name = "Livello Batteria " + device.name;
      obj.unique_id = device.id + "_battery_level";
      obj.state_topic = prefix + device.topic;
      obj.unit_of_measurement = "%";
      obj.device_class = "battery";
      obj.value_template = "{{ value_json.value }}";

      array.push( obj );

      let sensor = { "sensor": array }

      yamlPart = yaml.dump(sensor, { "forceQuotes": true});

      yamlData += "################# " +  device.name + " #################\n\n" + yamlPart + "\n";



    });

    

    res.header('Content-Type', 'text/yaml');
    res.send(yamlData);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/add', async (req, res) => {
  try {
    const devices = await readDevices();
    const newDevice = { id: req.body.id, topic: req.body.topic, name: req.body.name };
    devices.push(newDevice);
    await writeDevices(devices);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/edit', async (req, res) => {
  try {

    const devices = await readDevices();
    const deviceIdToEdit = req.body.origid;
    const newDeviceID = req.body.editid;
    const updatedDevices = devices.map(device => {
      if (device.id === deviceIdToEdit) {
        device.id = newDeviceID;
        device.topic = req.body.edittopic;
        device.name = req.body.editname;
      }


      return device;
    });
    if ( deviceIdToEdit !== newDeviceID )
    {
      const updatedDevices = devices.filter(device => device.id !== deviceIdToEdit);
      await writeDevices(updatedDevices);
    }
    else
    {
      await writeDevices(updatedDevices);
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/remove', async (req, res) => {
  try {
    const devices = await readDevices();
    const deviceIdToRemove = req.body.id;
    const updatedDevices = devices.filter(device => device.id !== deviceIdToRemove);
    await writeDevices(updatedDevices);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/save-settings', async (req, res) => {
  try {
    // Extract "topic-prefix" data from the request body
    const  topicPrefix  = req.body;

    if (!topicPrefix) {
      return res.status(400).json({ error: 'Missing "topic-prefix" in the request body' });
    }

    // Save the data as JSON
    await fs.writeFile( path.join(__dirname, '/data/settings.json'), JSON.stringify(topicPrefix, null, 2), 'utf-8');

    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get settings
app.get('/get-settings', async (req, res) => {
  try {
    // Read settings from settings.json
    const settingsData = await fs.readFile(path.join(__dirname, '/data/settings.json'), 'utf-8');
    const settings = JSON.parse(settingsData);

    res.json(settings);
  } catch (error) {
    console.error('Error reading settings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


async function readDevices() {
  try {
    const data = await fs.readFile(JSON_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw error;
  }
}

async function writeDevices(devices) {
  try {
    await fs.writeFile(JSON_FILE_PATH, JSON.stringify(devices, null, 2));
  } catch (error) {
    throw error;
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
