"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFallbackKernelAccountClient = void 0;
const createFallbackKernelAccountClient = (clients) => {
    const proxyClient = new Proxy(clients[0], {
        get(_target, prop, receiver) {
            for (const client of clients) {
                const value = Reflect.get(client, prop, receiver);
                if (value !== undefined) {
                    if (typeof value === "function") {
                        return async (...args) => {
                            for (let i = 0; i < clients.length; i++) {
                                try {
                                    const method = Reflect.get(clients[i], prop, receiver);
                                    if (typeof method === "function") {
                                        return await method(...args);
                                    }
                                }
                                catch (error) {
                                    console.error(`Action ${String(prop)} failed with client ${client.transport.url}, trying next if available.`, error);
                                    if (i === clients.length - 1) {
                                        throw error;
                                    }
                                }
                            }
                        };
                    }
                    return value;
                }
            }
            return undefined;
        }
    });
    return proxyClient;
};
exports.createFallbackKernelAccountClient = createFallbackKernelAccountClient;
//# sourceMappingURL=fallbackKernelAccountClient.js.map