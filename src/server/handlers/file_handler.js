const fs = require('fs');

const file = "./igem_data.json";
const react_src = "./src/igem_data.json";

/**
 * Return TRUE if data matches query q
 *
 * @param q
 * {
 *     NAME:[{contain: Bool, value: String}]
 *     .
 *     .
 *     .
 * }
 * EXAMPLE
 * {
        "name":[{"contain":false, "value": "2"}, {"contain":true, "value": "team"}],
        "year":[{"contain":true, "value": "2020"}]
    }
 */
const matchQuery = (data, q) => {
    try {
        let match = true;
        for(let prop in q) {
            match = q[prop].map(el => {
                const dProp = data[prop];
                if (el.contain) {
                    return dProp.toString().includes(el.value);
                } else {
                    return !dProp.toString().includes(el.value);
                }
            }).reduce((l,r) => l && r, true);

            if (!match) {
                return false;
            }
        }
    } catch (e) {
        console.log(e)
    }

    return true;
};

let fileContent = {
    teams: [],
    biobricks: [],
};

function saveToStorage() {
    fs.writeFile(file, JSON.stringify(fileContent, null, 2),(err) => {
        if (err) throw err;
        console.log(`The file has been saved! teams: ${fileContent.teams.length} biobricks: ${fileContent.biobricks.length}`);
    });
}

const FileHandler = {
    addTeam: (data) => {
        if (fileContent.teams.filter(el => el.teamId === data.teamId).length <= 0) {
            fileContent.teams.push(data);
            saveToStorage();
        } else {
            console.log(`Team ${data.teamId} already exist`)
        }
    },
    getTeams: () => {
        return fileContent.teams;
    },
    matchTeams: (query) => {
        return FileHandler.getTeams().filter(el => matchQuery(el, query));
    },
    addBiobricks: (data) => {
        if (fileContent.biobricks.filter(el => el.title === data.title).length <= 0) {
            fileContent.biobricks.push(data);
            saveToStorage();
        } else {
            console.log(`Biobricks ${data.title} already exist`)
        }
    },
    getBiobricks: () => {
        return fileContent.biobricks;
    },
    matchBiobricks: (query) => {
        return FileHandler.getBiobricks().filter(el => matchQuery(el, query));
    },
    storageExists: () => {
        return fs.existsSync(file)
    },
    copyToReact: () => {
        fs.copyFileSync(file, react_src);
    }
};

if (FileHandler.storageExists()) { // if storage file exist so you can load it
    let rawdata = fs.readFileSync(file);
    fileContent = JSON.parse(rawdata);
    console.log(`File ${file} loaded with teams: ${fileContent.teams.length} biobricks: ${fileContent.biobricks.length}`)
}

module.exports = FileHandler;