function toFullMATRIX(data = '') {
    const table = data.split('\n');
    let matrix = [];
    table.forEach(row => {
        const cols = row.split(',');
        let sanitezedCols = [];
        cols.map(elm => {
            sanitezedCols.push(elm.trim());
        });
        matrix.push(sanitezedCols);
    });
    return matrix;
}

function FromFullMATRIX(matrix = []) {
    let csv = '';
    matrix.map(row => {
        let csv_row = '';
        let csv_col = '';
        row.map((col, j) => {
            csv_row += `${col}`;
            if(j < row.length - 1) {
                csv_row += ', ';
            }
        });
        csv += `${csv_row}\n`;
    });
    return csv;
}

const defaultJSONOptions = {
    type: 'objectArray',
    primaryKey: '',
    maxLength: -1,
};

function toJSON(data, options = defaultJSONOptions) {
    
    try {

        for(let i = 0; i < Object.keys(defaultJSONOptions).length; i++) {
            options[Object.keys(defaultJSONOptions)[i]] = options[Object.keys(defaultJSONOptions)[i]] || defaultJSONOptions[Object.keys(defaultJSONOptions)[i]];
        }
    
        const parsers = {
            keyed: (m = [], options = {}) => {
                const indexs = m[0];
                const clearMatrix = m.slice(1);
    
                const keyArray = {};
                indexs.map((index, i) => {
                    let array = []
    
                    clearMatrix.map(row => {
                        array.push(row[i]);
                    });
    
                    keyArray[index] = array;
                });
                
                const primaryKey = options.primaryKey || Object.keys(keyArray)[0]
                const keys = keyArray[primaryKey];
                
                const obj = {};
                keys.map((row, i) => {
                    const elm = {};
    
                    clearMatrix[i].map((col, j) => {
                        if(col === row) return
                        elm[indexs[j]] = col;
                    })
    
                    obj[row] = elm;
                });
    
                return obj;
    
            },
            matrix: (m = [], options = {}) => {
                const clearMatrix = m.slice(1);
                return clearMatrix;
            },
            full: (m = [], options = {}) => {
                return m;
            },
            objectArray: (m = [], options = {}) => {
                const indexs = m[0];
                const clearMatrix = m.slice(1);
    
                const array = [];
                clearMatrix.map((row, i) => {
                    let obj = {};
                    row.map((col, j) => {
                        obj[indexs[j]] = col;
                    });
                    array.push(obj);
                });
    
                return array;
            },
            keyArray: (m = [], options = {}) => {
                const indexs = m[0];
                const clearMatrix = m.slice(1);
    
                const obj = {};
                indexs.map((index, i) => {
                    let array = []
    
                    clearMatrix.map(row => {
                        array.push(row[i]);
                    });
    
                    obj[index] = array;
                });
    
                return obj;
            },
        }
    
        const fullMatrix = toFullMATRIX(data);
        
        if(parsers[options.type]) {
            const json = parsers[options.type](fullMatrix, options);
            if( options.type === 'objectArray' && options.maxLength !== -1 ) {
                let max = options.maxLength
    
                const array = [];
    
                if(json.length < max) max = json.length;
    
                for(let i = 0; i < max; i++) {
                    array.push(json[i]);
                }
    
                return array;
            }
            return json;
        }
        else {
            const rtrn = { error: 'Invalid type for parsing', errorMessage: `The options.type string must be a proper value` };
            console.error(`\x1b[31m${rtrn.errorMessage}\x1b[0m`);
            return rtrn;
        }

    } catch(error) {
        const rtrn = { error, errorMessage: `Error on parsing CSV to JSON` };
        console.error(`\x1b[31m${rtrn.errorMessage}\x1b[0m`);
        return rtrn;
    }

}

function toCSV(data){
    
    try {

        Array.prototype.isArray = () => {
            return true;
        }

        const parsers = {
            objectArray: (json) => {
                const indexs = Object.keys(json[0]);

                let rows = [];
                json.map((row, i) => {
                    let cols = [];
                    for(let j = 0; j < indexs.length; j++) {
                        const col = row[indexs[j]];
                        cols.push(col);
                    }
                    rows.push(cols);
                });

                let fullMatrix = [];
                fullMatrix.push(indexs);
                rows.map(row => {
                    fullMatrix.push(row);
                });

                return fullMatrix;
            },
            keyArray: (json) => {
                
                const indexs = Object.keys(json);

                let rows = [];
                for(let i = 0; i < json[indexs[0]].length; i++){
                    let cols = [];
                    for(let j = 0; j < indexs.length; j++) {
                        cols.push(json[indexs[j]][i]);
                    }
                    rows.push(cols);
                }
                
                let fullMatrix = [];
                fullMatrix.push(indexs);
                rows.map(row => {
                    fullMatrix.push(row);
                });

                return fullMatrix;
            }
        }

        if(data.isArray) {
            return FromFullMATRIX(parsers.objectArray(data));
        } else if (typeof(data) !== 'string' && typeof(data) !== 'number' && data) {
            return FromFullMATRIX(parsers.keyArray(data));
        } else {
            const rtrn = { error: 'Datatype parsing not supported', errorMessage: `You must provide an object or an array to parse to CSV` };
            console.error(`\x1b[31m${rtrn.errorMessage}\x1b[0m`);
            return rtrn;
        }


    } catch (error) {
        const rtrn = { error, errorMessage: `Error on parsing JSON to CSV` };
        console.error(`\x1b[31m${rtrn.errorMessage}\x1b[0m`);
        return rtrn;
    }

}

module.exports = {
    toJSON,
    toCSV
}