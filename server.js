const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const ejs = require('ejs');

const app = express();
const PORT = 3000;
const JSON_FILE_PATH = 'data/devices.json';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('views', __dirname + '/views'); // Set the views directory

app.get('/', async (req, res) => {
  try {
    const devices = await readDevices();
    res.render('index', { devices });
  } catch (error) {
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
