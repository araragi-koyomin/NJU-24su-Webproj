const client = new WebSocket("ws://127.0.0.1:7003");

client.onmessage = (message) => {
    console.log(message.data);
}

client.onopen = () => {
    console.log("client connected");
}

export async function send(message) {
    client.send(message);
}