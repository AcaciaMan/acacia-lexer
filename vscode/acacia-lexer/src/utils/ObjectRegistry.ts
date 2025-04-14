import * as vscode from 'vscode';

export class ObjectRegistry {
    private static instance: ObjectRegistry;
    private registry: Map<string, any>;

    private constructor() {
        this.registry = new Map<string, any>();
    }

    // Get the singleton instance
    public static getInstance(): ObjectRegistry {
        if (!ObjectRegistry.instance) {
            ObjectRegistry.instance = new ObjectRegistry();
        }
        return ObjectRegistry.instance;
    }

    // Add an object to the registry
    public set(key: string, value: any): void {
        this.registry.set(key, value);
    }

    // Retrieve an object from the registry
    public get<T>(key: string): T | undefined {
        return this.registry.get(key) as T;
    }

    // Remove an object from the registry
    public delete(key: string): void {
        this.registry.delete(key);
    }

    // Check if an object exists in the registry
    public has(key: string): boolean {
        return this.registry.has(key);
    }

    // Clear all objects from the registry
    public clear(): void {
        this.registry.clear();
    }

    public setSelectedFolder(folder: string): void {
        this.set('selectedFolder', folder);
        const config = vscode.workspace.getConfiguration('acaciaLexer');
        config.update('selectedFolder', folder, vscode.ConfigurationTarget.Workspace).then(() => {
            console.log(`Selected folder updated to: ${folder}`);
        }, (error) => {
            console.error(`Error updating selected folder: ${error}`);
        });
    }

    public getSelectedFolder(): string | undefined {
        let selectedFolder = this.get<string>('selectedFolder');
        if (!selectedFolder) {
            const config = vscode.workspace.getConfiguration('acaciaLexer');
            selectedFolder = config.get<string>('selectedFolder');
            if (selectedFolder) {
                this.set('selectedFolder', selectedFolder);
            } else {
                console.warn('No selected folder found in configuration.');
                return undefined;
            }
        }
        
        return selectedFolder;
    }
}