import { createWorker, type Worker } from 'tesseract.js';

export default class TesseractService {
  private static __worker: Worker | null = null;

  static async start() {
    this.__worker = await createWorker('eng');
  }

  static async recognize(image: string) {
    if (!this.__worker) {
      throw new Error('Tesseract worker not started');
    }
    const result = await this.__worker.recognize(image);
    console.log(result);
    return result;
  }

  static async terminate() {
    if (!this.__worker) {
      console.warn('Tesseract worker not started');
      return;
    }
    await this.__worker.terminate();
    this.__worker = null;
  }
}
