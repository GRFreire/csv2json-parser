# csv2json-parser

## Convert csv to json and vice versa

### Installation

- Npm
```
npm install csv2json-parser --save
```
- Yarn
```
yarn add csv2json-parser
```

### Usage

> #### Converting CSV to JSON

simple method:
```js
const { toJSON } = require('csv2json-parser');

const objectArray = toJSON(csv_string); //returns an objectArray(default) object format

```
using diferents object formats:
```js
const objectArray = toJSON(csv_string, { type: 'keyArray' }); //returns an keyArray object format
```
using ```keyed``` object format:

 - keep ```primaryKey``` empty for using the first key as primary key
```js
const objectArray = toJSON(csv_string, {
    type: 'keyed',
    primaryKey: 'name'
}); //returns an keyed object format
```
limiting length:
```js
const objectArray = toJSON(csv_string, { maxLength: 5 }); //returns an objectArray(default) object format with max length of 5
```

 > #### Converting CSV to JSON

```js
const { toCSV } = require('csv2json-parser');

const csv = toCSV(object_or_array); //returns a csv string

```

> ### Object formats

 - #### objectArray
 ```json
 [
    {
        "id": 0,
        "country": "Brazil",
        "region": "South America"
    },
    {
        "id": 1,
        "country": "United States",
        "region": "North America"
    }
]
 ```

  - #### keyArray
 ```json
{
   "id":[0,1],
   "country":["Brazil", "United States"],
   "region":["South America", "North America"]
}
 ```

  - #### keyed
 ```json
{
   "0": {
      "country": "Brazil",
      "region": "South America"
   },
   "1": {
      "country": "United States",
      "region": "North America"
   }
}
 ```


### Object formats supported for parsing to CSV

 - objectArray
 - keyArray