import { createWorker, type Worker } from 'tesseract.js';

export default class TesseractService {
  private static __worker: Worker | null = null;

  static async recognize(canvas: HTMLCanvasElement) {
    if (!this.__worker) {
      this.__worker = await createWorker('eng');
    }
    return await this.__worker.recognize(canvas);
  }

  static async stop() {
    if (!this.__worker) {
      console.warn('Tesseract worker not started');
      return;
    }
    await this.__worker.terminate();
    this.__worker = null;
  }
}
