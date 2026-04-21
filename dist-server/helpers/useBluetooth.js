import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useCallback, } from 'react';
import { BleClient } from '@capacitor-community/bluetooth-le';
const BluetoothContext = createContext(undefined);
const DEVICE_INFO_SERVICE = "0000180a-0000-1000-8000-00805f9b34fb";
const BATTERY_SERVICE = "0000180f-0000-1000-8000-00805f9b34fb";
const BATTERY_CHARACTERISTIC = "00002a19-0000-1000-8000-00805f9b34fb";
const VISION_SERVICE = "10000000-0000-1000-8000-00805f9b34fb";
const VISION_CHARACTERISTIC = "10000001-0000-1000-8000-00805f9b34fb";
const STORAGE_KEY = "@vision_last_device_id";
export const BluetoothProvider = ({ children }) => {
    const [connectionState, setConnectionState] = useState('disconnected');
    const [deviceName, setDeviceName] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [batteryLevel, setBatteryLevel] = useState(null);
    const [visionMode, setVisionMode] = useState(null);
    const [error, setError] = useState(null);
    const [isSupported, setIsSupported] = useState(false);
    const parseVisionMode = (val) => {
        if (val === 0x01)
            return 'smart';
        if (val === 0x02)
            return 'full';
        return 'off';
    };
    const disconnect = useCallback(async () => {
        if (deviceId) {
            try {
                await BleClient.disconnect(deviceId);
            }
            catch (e) {
                console.error("Erro ao desconectar do dispositivo BLE:", e);
            }
        }
        setConnectionState('disconnected');
        setDeviceId(null);
        setDeviceName(null);
        setBatteryLevel(null);
        setVisionMode(null);
        setError(null);
        localStorage.removeItem(STORAGE_KEY);
    }, [deviceId]);
    const connect = useCallback(async (id, name) => {
        try {
            setConnectionState('connecting');
            setError(null);
            await BleClient.connect(id, (disconnectedId) => {
                console.log(`Dispositivo ${disconnectedId} foi desconectado.`);
                setConnectionState('disconnected');
                setDeviceId(null);
                setDeviceName(null);
                setBatteryLevel(null);
                setVisionMode(null);
            });
            setDeviceId(id);
            if (name)
                setDeviceName(name);
            else
                setDeviceName("Óculos Vision");
            localStorage.setItem(STORAGE_KEY, id);
            // Setup Battery Service
            try {
                const batteryData = await BleClient.read(id, BATTERY_SERVICE, BATTERY_CHARACTERISTIC);
                setBatteryLevel(batteryData.getUint8(0));
                await BleClient.startNotifications(id, BATTERY_SERVICE, BATTERY_CHARACTERISTIC, (value) => {
                    setBatteryLevel(value.getUint8(0));
                });
            }
            catch (e) {
                console.warn("Serviço de bateria não suportado ou erro ao ler:", e);
            }
            // Setup Vision Mode Service
            try {
                const visionData = await BleClient.read(id, VISION_SERVICE, VISION_CHARACTERISTIC);
                setVisionMode(parseVisionMode(visionData.getUint8(0)));
                await BleClient.startNotifications(id, VISION_SERVICE, VISION_CHARACTERISTIC, (value) => {
                    setVisionMode(parseVisionMode(value.getUint8(0)));
                });
            }
            catch (e) {
                console.warn("Serviço de modo de visão não suportado ou erro ao ler:", e);
            }
            setConnectionState('connected');
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : "Erro desconhecido";
            console.error("Falha na conexão BLE:", err);
            setError(`Não foi possível conectar: ${msg}`);
            setConnectionState('disconnected');
            setDeviceId(null);
            setDeviceName(null);
            throw err;
        }
    }, []);
    const scan = useCallback(async () => {
        try {
            setConnectionState('scanning');
            setError(null);
            const device = await BleClient.requestDevice({
                optionalServices: [DEVICE_INFO_SERVICE, BATTERY_SERVICE, VISION_SERVICE],
            });
            if (device) {
                await connect(device.deviceId, device.name);
            }
            else {
                setConnectionState('disconnected');
            }
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : "Erro desconhecido";
            console.error("Falha ao escanear dispositivos BLE:", err);
            // O usuário pode cancelar o scan
            if (msg.toLowerCase().includes("user cancelled")) {
                setConnectionState('disconnected');
                return;
            }
            setError(`Erro durante a busca de dispositivos: ${msg}`);
            setConnectionState('disconnected');
        }
    }, [connect]);
    useEffect(() => {
        let isMounted = true;
        const initBle = async () => {
            try {
                await BleClient.initialize();
                if (isMounted) {
                    setIsSupported(true);
                }
                const lastId = localStorage.getItem(STORAGE_KEY);
                if (lastId && isMounted) {
                    try {
                        await connect(lastId);
                    }
                    catch (e) {
                        console.log("Falha ao auto-reconectar. O dispositivo pode estar fora de alcance.");
                    }
                }
            }
            catch (err) {
                console.error("Bluetooth não suportado ou erro de inicialização:", err);
                if (isMounted) {
                    setIsSupported(false);
                    setError("O Bluetooth não é suportado ou não tem permissão neste dispositivo.");
                }
            }
        };
        initBle();
        return () => {
            isMounted = false;
        };
    }, [connect]);
    const value = {
        connectionState,
        deviceName,
        deviceId,
        batteryLevel,
        visionMode,
        error,
        isSupported,
        scan,
        connect,
        disconnect,
    };
    return (_jsx(BluetoothContext.Provider, { value: value, children: children }));
};
export const useBluetooth = () => {
    const context = useContext(BluetoothContext);
    if (context === undefined) {
        throw new Error("useBluetooth deve ser usado dentro de um BluetoothProvider");
    }
    return context;
};
