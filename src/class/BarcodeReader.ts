import * as HID from 'node-hid';

export class BarcodeReader {
    private device: HID.HID;

    constructor(vendorId?: number, productId?: number) {
        
        
        const devices: HID.Device[] = HID.devices();

        console.log(devices)

        // const devices: HID.Device[] = HID.devices().filter(device => {
        //     return device.vendorId === vendorId && device.productId === productId;
        // });

        if (devices.length === 0) {
            throw new Error('No se encontraron dispositivos de lector de códigos de barras USB.');
        }

        this.device = new HID.HID(devices[0].path as string);
        this.initListeners();
    }

    private initListeners() {
        this.device.on('data', (data: Buffer) => {
            console.log('Datos leídos:', data.toString('utf8'));
            // Aquí puedes emitir un evento, llamar a una función de manejo, etc.
        });

        this.device.on('error', (err: Error) => {
            console.error('Error en el dispositivo USB:', err);
        });

        this.device.on('close', () => {
            console.log('Conexión cerrada con el dispositivo USB.');
        });

        this.device.on('detach', () => {
            console.log('Dispositivo USB desconectado.');
            process.exit(0);
        });
    }

    // Método para cerrar la conexión del dispositivo
    public close() {
        this.device.close();
    }
}