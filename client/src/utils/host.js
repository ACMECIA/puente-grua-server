// var host = "";

// var hostNode = "";

// export function setHost(newHost, port) {
//   host = `${newHost}:${port}`;
// }

// export function setHostNode(newHost, port) {
//   hostNode = `${newHost}:${port}`;
// }

// export function getHostPath(path) {
//   return `${host}/${path}`;
// }

// export function getHostNodePath(path) {
//   return `${hostNode}/${path}`;
// }

var host = "";

var hostNode = `http://${process.env.REACT_APP_NODE_HOST}:${process.env.REACT_APP_NODE_PORT}`;

export function setHost(newHost, port) {
  host = `${newHost}:${port}`;
}

export function setHostNode(newHost, port) {
  hostNode = `${newHost}:${port}`;
}

export function getHostPath(path) {
  return `${host}/${path}`;
}

export function getHostNodePath(path) {
  console.log(`${hostNode}/${path}`);
  return `${hostNode}/${path}`;
}