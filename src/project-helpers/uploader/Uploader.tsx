import { useEffect, useState, useRef, type FC } from 'react';
// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

export default function FileUpload() {
  const [files, setFiles] = useState<any[]>([]);
  return (
    <div className="App">
      <FilePond
								server={
									{url: 'https://balanced-leland-hourglass98-057c6940.koyeb.app/upload'}
								}
        files={files}
        onupdatefiles={(fileItems: any[]) => setFiles(fileItems)}
        allowMultiple={false} // Set true if multiple files are allowed
        maxFiles={1}
        name="file" // Field name for server
        labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
        chunkUploads={true}
      />
    </div>
  );
}