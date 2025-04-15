import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
//import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

import { FileUtils } from '../utils/FileUtils';
// create jest test
describe('Extension Test Suite', () => {
	it('should activate the extension', async () => {
		console.log('Running extension test suite...');
	});

	it('read file and print to console 10 characters', async () => {
		const filePath = 'C:/work/GitHub/wordpress-develop/src/wp-blog-header.php';
		const fileUtils = new FileUtils(filePath);
		fileUtils.initializeChunkReader(1028);
		for (let i = 0; i < 10; i++) {
			
		let code = await fileUtils.decodeUtf8();
		// print the character of utf-8 code
		let char = code !== undefined ? String.fromCharCode(code) : '';
		console.log(char);
		console.log(code);
		}
	}
	);

	it('print codes of the characters', async () => {
		console.log('0 ' + '0'.charCodeAt(0));
		console.log('9 ' + '9'.charCodeAt(0));
		console.log('a ' + 'a'.charCodeAt(0));
		console.log('z ' + 'z'.charCodeAt(0));
		console.log('A ' + 'A'.charCodeAt(0));
		console.log('Z ' + 'Z'.charCodeAt(0));
	});


});