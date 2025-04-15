import * as fs from 'fs';

export class FileUtils {
    private _filePath: string;
    private _readStream: fs.ReadStream | null = null;
    private _chunkQueue: Buffer[] = [];
    private _isReading: boolean = false;
    private _currentChunkIndex: number = 0;
    private _currentCharacterIndex: number = 0;

    constructor(filePath: string) {
        this._filePath = filePath;
    }

    public getFilePath(): string {
        return this._filePath;
    }

    public initializeChunkReader(chunkSize: number): void {
        if (this._readStream) {
            this._readStream.close(); // Close any existing stream
        }

        this._readStream = fs.createReadStream(this._filePath, { highWaterMark: chunkSize });

        this._readStream.on('data', (chunk) => {
            if (Buffer.isBuffer(chunk)) {
                this._chunkQueue.push(chunk); // Add chunk to the queue
            } else {
                console.error('Received chunk is not a Buffer');
            }
        });

        this._readStream.on('end', () => {
            this._isReading = false; // Mark reading as complete
        });

        this._readStream.on('error', (err) => {
            console.error(`Error reading file: ${err.message}`);
            this._isReading = false;
        });

        this._isReading = true;
    }

    public getNextChunk(): Buffer | null {
        if (this._chunkQueue.length > 0) {
            return this._chunkQueue.shift() || null; // Return the next chunk from the queue
        }

        if (!this._isReading) {
            return null; // No more chunks to read
        }

        return null; // No chunks available yet, but reading is still in progress
    }

    public closeReader(): void {
        if (this._readStream) {
            this._readStream.close();
            this._readStream = null;
        }
        this._chunkQueue = [];
        this._isReading = false;
    }



    // get next character from the file
    public async getNextCharacter(): Promise<number | undefined>  {

        while (this._isReading && this._currentChunkIndex >= this._chunkQueue.length) {
            // wait 100 ms
            await wait(100); // Wait for chunks to be read
        }
                

        if (this._currentChunkIndex >= this._chunkQueue.length) {
            return undefined; // No more chunks to read
        }

        const chunk = this._chunkQueue[this._currentChunkIndex];
        if (this._currentCharacterIndex >= chunk.length) {
            this._currentChunkIndex++;
            this._currentCharacterIndex = 0;
            return this.getNextCharacter(); // Recursive call to get the next character
        }

        const charCode = chunk[this._currentCharacterIndex];
        this._currentCharacterIndex++;
        return charCode; // Return the character code
    }

    public async decodeUtf8(): Promise<number | undefined> {
        const bytes0 = await this.getNextCharacter();
        if (bytes0 === undefined) {
            return undefined; // No more bytes to read
        }
        let charCode = 0;
    
        if (bytes0 < 0x80) {
            // 1-byte sequence
            charCode = bytes0;
        } else if ((bytes0 & 0xE0) === 0xC0) {
            // 2-byte sequence
            const bytes1 = await this.getNextCharacter();
            if (bytes1 === undefined) {
                return undefined; // No more bytes to read
            }
            charCode = ((bytes0 & 0x1F) << 6) | (bytes1 & 0x3F);
        } else if ((bytes0 & 0xF0) === 0xE0) {
            // 3-byte sequence
            const bytes1 = await this.getNextCharacter();
            const bytes2 = await this.getNextCharacter();
            if (bytes1 === undefined || bytes2 === undefined) {
                return undefined; // No more bytes to read
            }
            charCode = ((bytes0 & 0x0F) << 12) | ((bytes1 & 0x3F) << 6) | (bytes2 & 0x3F);
        } else if ((bytes0 & 0xF8) === 0xF0) {
            // 4-byte sequence
            const bytes1 = await this.getNextCharacter();
            const bytes2 = await this.getNextCharacter();
            const bytes3 = await this.getNextCharacter();
            if (bytes1 === undefined || bytes2 === undefined || bytes3 === undefined) {
                return undefined; // No more bytes to read
            }
            charCode = ((bytes0 & 0x07) << 18) | ((bytes1 & 0x3F) << 12) | ((bytes2 & 0x3F) << 6) | (bytes3 & 0x3F);
        }
    
        return charCode;
    };

}


function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}