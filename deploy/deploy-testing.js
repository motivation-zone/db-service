const {spawn} = require('child_process');
const path = require('path');
const fs = require('fs');

const CYellow = '\x1b[33m';
const CRed = '\x1b[31m';
const CGreen = "\x1b[32m";
const CReset = "\x1b[0m"

const CONTAINER_NAME = 'mz-db-service';
const DOCKER_HUB = 'motivationzone/dbservice';

const rootPath = path.resolve(__dirname, '..');

const makefile = fs.readFileSync(rootPath + '/Makefile').toString();
const packagejson = fs.readFileSync(rootPath + '/package.json').toString();
const version = JSON.parse(packagejson).version;

const dockerUser = process.env.MZ_DB_SERVICE_DOCKER_USER;
const dockerPassword = process.env.MZ_DB_SERVICE_DOCKER_PASS;

const dockerPs = `$(docker ps --filter "name=${CONTAINER_NAME}" -q -a)`;
const commands = [
    `echo '${makefile}' > /tmp/Makefile`,
    `echo '${packagejson}' > /tmp/package.json`,
    'cd /tmp',
    `docker login -u ${dockerUser} -p ${dockerPassword}`,
    `docker pull ${DOCKER_HUB}:${version}`,
    `docker kill ${dockerPs} || true`,
    `docker rm -f ${dockerPs} || true`,
    'make docker.run.testing image_id=' +
        `$(docker images --filter=reference="${DOCKER_HUB}:${version}" -q)`,
    'rm -rf Makefile package.json'
].join(' && ');

const cmd = spawn('ssh', ['root@176.99.11.253', commands]);

cmd.stdout.on('data', (data) => {
    console.log(`${CYellow}%s${CReset}`, data.toString());
});

cmd.stderr.on('data', (data) => {
    console.log(`${CRed}%s${CReset}`, data.toString());
});

cmd.on('exit', (code) => {
    console.log(`${CGreen}%s${CReset}`, `Child exited with code ${code}`);
});
