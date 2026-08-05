import net from 'node:net';

/**
 * Get a unused free port for web server.
 * @returns {Promise<number>} Available free port.
 */
function getFreePort() {
	return new Promise((resolve, reject) => {
		const server = net.createServer();
		server.listen(0, () => {
			const address = /** @type {net.AddressInfo} */ (server.address());
			server.close(() => resolve(address.port));
		});
		server.on('error', (err) => reject(err));
	});
}

const freePort = await getFreePort();
console.log(freePort);
