/**
 * Internal dependencies
 */
import EditorPage from './pages/editor-page';
import {
	setupDriver,
	isLocalEnvironment,
	stopDriver,
	isAndroid,
} from './helpers/utils';
import testData from './helpers/test-data';

jest.setTimeout( 1000000 );

describe( 'Gutenberg Editor tests', () => {
	let driver;
	let editorPage;
	let allPassed = true;

	// Use reporter for setting status for saucelabs Job
	if ( ! isLocalEnvironment() ) {
		const reporter = {
			specDone: async ( result ) => {
				allPassed = allPassed && result.status !== 'failed';
			},
		};

		jasmine.getEnv().addReporter( reporter );
	}

	beforeAll( async () => {
		driver = await setupDriver();
		editorPage = new EditorPage( driver );
	} );

	it( 'should be able to see visual editor', async () => {
		await expect( editorPage.getBlockList() ).resolves.toBe( true );
	} );

	it( 'should be able to create a post with heading and paragraph blocks', async () => {
		await editorPage.addNewHeadingBlock();
		let headingBlockElement = await editorPage.getHeadingBlockAtPosition(
			1
		);

		if ( isAndroid() ) {
			await headingBlockElement.click();
		}
		await editorPage.sendTextToHeadingBlock(
			headingBlockElement,
			testData.heading,
			false
		);

		await editorPage.addNewParagraphBlock();
		let paragraphBlockElement = await editorPage.getParagraphBlockAtPosition(
			2
		);
		await editorPage.sendTextToParagraphBlock(
			paragraphBlockElement,
			testData.mediumText
		);

		await editorPage.addNewParagraphBlock();
		paragraphBlockElement = await editorPage.getParagraphBlockAtPosition(
			3
		);
		await editorPage.sendTextToParagraphBlock(
			paragraphBlockElement,
			testData.mediumText
		);

		await editorPage.addNewHeadingBlock();
		headingBlockElement = await editorPage.getHeadingBlockAtPosition( 4 );
		await editorPage.sendTextToHeadingBlock(
			headingBlockElement,
			testData.heading,
			false
		);

		await editorPage.addNewParagraphBlock();
		paragraphBlockElement = await editorPage.getParagraphBlockAtPosition(
			5
		);
		await editorPage.sendTextToParagraphBlock(
			paragraphBlockElement,
			testData.mediumText
		);
	} );

	afterAll( async () => {
		if ( ! isLocalEnvironment() ) {
			driver.sauceJobStatus( allPassed );
		}
		await stopDriver( driver );
	} );
} );