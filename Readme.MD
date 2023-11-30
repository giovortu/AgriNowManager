## AgriNowManager

We interface to manage Lifely Lemon devices using EspNow communication protocol.
The purpose of the manager is to create and manage a database of devices.
This allows us to keep track of all used device and their hardware ids.
The data is saved in a local JSON file.

The manager can generate an sensors Home Assistant ( https://www.home-assistant.io/ ) configuration file.

### Examples

#### Devices database
```
[
  {
    "id": "3398534",
    "topic": "pomodori",
    "name": "Pomodori"
  },
  {
    "id": "3398804",
    "topic": "peperoni",
    "name": "Peperoni"
  },
  {
    "id": "3398655",
    "topic": "pothos",
    "name": "Pothos"
  }
]
```

#### Generated YAML configuration file

```
################# Pomodori #################

sensor:
  - name: 'Temperatura Pomodori'
    unique_id: '3398534_temperature'
    state_topic: 'casaortu/sensors/pomodori'
    unit_of_measurement: '°C'
    device_class: 'temperature'
    value_template: '{{ value_json.value }}'
  - name: 'Suolo Pomodori'
    unique_id: '3398534_soil_moisture'
    state_topic: 'casaortu/sensors/pomodori'
    unit_of_measurement: '%'
    device_class: 'moisture'
    value_template: '{{ value_json.value }}'
  - name: 'Luminosita Pomodori'
    unique_id: '3398534_luminosity'
    state_topic: 'casaortu/sensors/pomodori'
    unit_of_measurement: 'lumen'
    device_class: 'illuminance'
    value_template: '{{ value_json.value }}'
  - name: 'Livello Batteria Pomodori'
    unique_id: '3398534_battery_level'
    state_topic: 'casaortu/sensors/pomodori'
    unit_of_measurement: '%'
    device_class: 'battery'
    value_template: '{{ value_json.value }}'
```

#### Related projects
https://github.com/giovortu/Agrumino
https://github.com/giovortu/esp_now_router
https://github.com/giovortu/BTicinoEsp
https://github.com/giovortu/ESPReceiver