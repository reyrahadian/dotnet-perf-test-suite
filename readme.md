# dotnet app performance test suite
This repo provide a performance test suite to measure the performance of your dotnet application.

## Pre-requisite
* Docker Desktop
* WSL, install Ubuntu 20.x as the default distro
* k6
* vscode (optional but recommended)

## Getting Started
* Open WSL terminal
* Go to the performance test folder and run `code .` - this will open vscode as your IDE
* Rename `.env.example` to `.env`, update the paths
* Run `docker compose up -d` in the vscode integrated terminal to start the containers

### Updating the app code
The `.env` file is pointing to your app bin folder path, everytime you generate new dlls this will be immediately reflected in the containers as it's mounted into the containers

### Run load test
Add `app1.localhost` and `app2.localhost` to your host file. The load test script will hit these domain names to generate traffic.
`load-test-example.js` is provided as a baseline for you to create your specific load test scenarios. It supports concurrent users creating their own individual (guest) tokens which are stored temporarily in the local redis container and re-generated when needed.

To run the load test, in your windows terminal, enter the command `k6 run load-test-example.js`

### Viewing the performance reports
* Open the Grafana Dashboard at `http://localhost:3000/login`
* The default admin credential is `admin`/`admin`
* Once logged-in, follow these steps
    * Configure a new `prometheus` datasource, leave the default name as is. Enter `http://host.docker.internal:30090` and click save & test - this should succeed
    * Configure a new `loki` datasource, leave the default name as is. Enter `http://host.docker.internal:3101` and click save & test - this should succeed
    * Click on the dashboard section and choose import dashboard. You can find the dashboard examples in `./apps/grafana-dashboard`

### Running two apps for performance comparison in parallel
* Update `.env` with the appropriate paths for app2
* Run `docker compose -f docker-compose.yml -f docker-compose.app2.override.yml up -d` to start the containers

### Generating memory dumps
There are two ways to generate memory dumps

1. Using dotnet monitor
    * Access `http://localhost:52323/dump?pid=1&type=Full` to generate memory dumps from bff app1
    * Access `http://localhost:52327/dump?pid=1&type=Full` to generate memory dumps from bff app2

2. Using jetbrains dotMemory
    * Open a terminal inside the running bff app1 container, and execute `/tools/dotmemory-getsnapshot.sh` to generate a memory dump in `/data/app1`