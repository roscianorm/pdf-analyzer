const inputFiles = document.getElementById('data')
const inputKeywords = document.getElementById('keywords')
const testFilesBtn = document.getElementById('tryFiles')

const PDFJSs = window['pdfjs-dist/build/pdf']
PDFJSs.GlobalWorkerOptions.workerSrc = 'js/pdf.js/pdf.worker.js'

const BASE64_MARKER = ';base64,'

testFilesBtn.addEventListener('click', (e) => {
	e.preventDefault()
	const files = [...inputFiles.files]
	files.map((file) => {
		if (file.type !== 'application/pdf') return

		const reader = new FileReader()
		reader.addEventListener('load', (e) => {
			const readerResult = e.target.result
			const base64Index =
				readerResult.indexOf(BASE64_MARKER) + BASE64_MARKER.length
			const base64 = readerResult.substring(base64Index)
			const raw = window.atob(base64)
			const rawLength = raw.length
			const pdfAsArray = new Uint8Array(new ArrayBuffer(rawLength))
			for (let i = 0; i < rawLength; i++) {
				pdfAsArray[i] = raw.charCodeAt(i)
			}
			// -----------------------
			getPDFContent(pdfAsArray) // Unknown
			// -----------------------
		})
		reader.readAsDataURL(file)
	})
})

// Unknown

function getPageText(pageNum, PDFDocInstance) {
	// Return a Promise that is solved once the text of the page is retrieved
	return new Promise((resolve, reject) => {
		PDFDocInstance.getPage(pageNum).then((pdfPage) => {
			// With the getTextContent method you'll be able to obtain the text of the PDF page
			pdfPage.getTextContent().then((textContent) => {
				// Concatenate string of the item
				const pageText = [...textContent.items].reduce(
					(prevVal, currVal) => prevVal + `${currVal.str} `,
					''
				)
				// Solve promise with the text retrieved from the page
				resolve(pageText)
			})
		})
	})
}

function getPDFContent(pdfAsArray) {
	PDFJSs.getDocument(pdfAsArray).promise.then(
		(pdf) => {
			let pdfDocument = pdf
			// Create an array that will contain our promises
			const pagesPromises = []

			for (let i = 0; i < pdf._pdfInfo.numPages; i++) {
				// Required to prevent that i is always the total of pages
				;(function (pageNumber) {
					// Store the promise of getPageText that returns the text of a page
					pagesPromises.push(getPageText(pageNumber, pdfDocument))
				})(i + 1)
			}

			// Execute all the promises
			Promise.all(pagesPromises).then(function (pagesText) {
				// Display text of all the pages in the console
				// e.g ["Text content page 1", "Text content page 2", "Text content page 3" ... ]
				console.log(pagesText) // representing every single page of PDF Document by array indexing
				console.log(pagesText.length)
				let outputStr = ''
				for (let pageNum = 0; pageNum < pagesText.length; pageNum++) {
					console.log(pagesText[pageNum])
					outputStr = ''
					outputStr =
						'<br/><br/>Page ' + (pageNum + 1) + ' contents <br/> <br/>'

					let div = document.getElementById('output')

					div.innerHTML += outputStr + pagesText[pageNum]
				}
			})
		},
		(reason) => {
			// PDF loading error
			console.error(reason)
		}
	)
}
