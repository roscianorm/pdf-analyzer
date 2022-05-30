const PDFJSs = window['pdfjs-dist/build/pdf']
PDFJSs.GlobalWorkerOptions.workerSrc = 'js/pdf.js/pdf.worker.js'

const inputFiles = document.getElementById('data')
const inputKeywords = document.getElementById('keywords')
let keywords = []
const testFilesBtn = document.getElementById('tryFiles')
const results = document.querySelector('.modal.results')

const BASE64_MARKER = ';base64,'

testFilesBtn.addEventListener('click', (e) => {
	e.preventDefault()

	keywords = []
	keywords.push(...inputKeywords.value.split(',').map((word) => word.trim()))

	results.innerHTML = ''
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

			file.pdfAsArray = new Uint8Array(new ArrayBuffer(raw.length))
			for (let i = 0; i < raw.length; i++) {
				file.pdfAsArray[i] = raw.charCodeAt(i)
			}
			getPDFContent(file)
		})
		reader.readAsDataURL(file)
	})
})

function getPageText(pageNum, PDFDocInstance) {
	// Return a Promise that is solved once the text of the page is retrieved
	return new Promise((resolve, reject) => {
		PDFDocInstance.getPage(pageNum).then((pdfPage) => {
			// With the getTextContent method you'll be able to obtain the text of the PDF page
			pdfPage.getTextContent().then((textContent) => {
				// Concatenate string of the item
				const pageText = [...textContent.items].reduce(
					(prevVal, currVal) => `${prevVal}${currVal.str} `,
					''
				)
				// Solve promise with the text retrieved from the page
				resolve(pageText)
			})
		})
	})
}

function getPDFContent(file) {
	PDFJSs.getDocument(file.pdfAsArray).promise.then(
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

			Promise.all(pagesPromises)
				.then((pagesText) => {
					// Gets the text of all the pages in the pdf and add them to the file object
					file.text = pagesText.reduce((prevVal, currVal, index) => {
						return `${prevVal} (Page ${index + 1} of ${
							pagesText.length
						}) ${currVal}`
					}, '')

					file.totalPages = pagesText.length
					return file
				})
				.then((file) => {
					file.keywords = keywords.map((word) => {
						return { word, isPresent: file.text.includes(word) ? true : false }
					})
					return file
				})
				.then((file) => {
					results.insertAdjacentHTML(
						'beforeend',
						`
						<div>
							<p>${file.name}</p>
							<ol>
								${file.keywords
									.map(
										(word) =>
											`<li>${word.word}: ${word.isPresent ? '✅' : '❌'}</li>`
									)
									.join('')}
							</ol>
						</div>
					`
					)
					results.classList.remove('hide')
				})
		},
		(reason) => {
			// PDF loading error
			console.error(reason)
		}
	)
}
