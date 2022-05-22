# PDF Analyzer

## Docs

- 📄PDF.js
  - [Docs](https://mozilla.github.io/pdf.js/getting_started/)
  - [Repository](https://github.com/mozilla/pdf.js)
- input[type="file"]

  - [Using files from web applications](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications)
  - [input[type="file"]](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file)
  - [FileList](https://developer.mozilla.org/en-US/docs/Web/API/FileList)

    - [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob)
    - [File](https://developer.mozilla.org/en-US/docs/Web/API/File)
      - [MIME type](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type)
      - [MIME type formats](https://www.iana.org/assignments/media-types/media-types.xhtml)

  - [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
    - [readAsDataURL()](https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL)
      - [Data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs)
  - [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  - [Other APIs](https://developer.mozilla.org/en-US/docs/Web/API)
    - [btoa()](https://developer.mozilla.org/en-US/docs/Web/API/btoa)
    - [atob()](https://developer.mozilla.org/en-US/docs/Web/API/atob)

## Code Examples

Click on `input[type="file"]` to load a file then click on `input[value="Load File!"]` to get a `File object` that contains the `data:URL` of such a file in the console:

```html
<input type="file" id="file" />
<input type="button" id="getFileBtn" value="Load file!" />
```

```javascript
const inputFile = document.getElementById('file')
const getFileBtn = document.getElementById('getFileBtn')

getFileBtn.addEventListener('click', () => {
	const file = inputFile.files[0]

	console.log(file instanceof Blob) // true
	console.log(file instanceof File) // true

	const reader = new FileReader()
	reader.onload = (e) => {
		file.dataURL = e.target.result
		console.log(file)
	}
	reader.readAsDataURL(file)
})
```
