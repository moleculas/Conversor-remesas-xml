import { useState, useRef } from 'react';

function FileUploader({ onFileUpload, isFileValid = true }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && (selectedFile.type === 'text/xml' || selectedFile.name.endsWith('.xml'))) {
      setFile(selectedFile);
      readFile(selectedFile);
    } else if (selectedFile) {
      alert('Por favor, selecciona un archivo XML válido.');
    }
  };

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      onFileUpload(file, content);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragActive(false);

    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'text/xml' || droppedFile.name.endsWith('.xml'))) {
      setFile(droppedFile);
      readFile(droppedFile);
    } else if (droppedFile) {
      alert('Por favor, arrastra un archivo XML válido.');
    }
  };
  
  const handleClick = () => {
    fileInputRef.current.click();
  };
  
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const fileUploaded = file !== null;
  const fileName = file ? file.name : '';
  const fileSize = file ? formatFileSize(file.size) : '';

  return (
    <div className="mb-8">
      <div
        className={`border-2 border-dashed h-[100px] ${
          isDragActive 
            ? 'border-primary bg-primary-50' 
            : fileUploaded 
              ? (isFileValid ? 'border-success bg-success-50' : 'border-error bg-error-50')
              : 'border-gray-300 bg-gray-50'
        } rounded-lg p-4 text-center cursor-pointer transition-colors duration-200 flex items-center justify-center`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".xml"
          onChange={handleFileChange}
        />

        {fileUploaded ? (
          <div className="flex flex-col items-center">
            {isFileValid ? (
              <svg className="w-8 h-8 text-success mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : (
              <svg className="w-8 h-8 text-error mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
            <p className={`text-base font-medium ${isFileValid ? 'text-success-700' : 'text-error-700'}`}>
              Archivo cargado: {fileName}
            </p>
            <p className="text-xs text-gray-600">
              Tamaño: {fileSize}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="text-base font-medium text-gray-700">
              Arrastra y suelta tu archivo XML aquí
            </p>
            <p className="text-xs text-gray-600">
              o haz clic para seleccionar un archivo
            </p>
          </div>
        )}
      </div>

      {/* Mensaje sobre el formato esperado */}
      <div className="mt-2 text-sm text-center">
        El archivo debe tener el formato: <span className="font-mono bg-gray-100 p-1 rounded">Remesa_R000000.xml</span>
      </div>
    </div>
  );
}

export default FileUploader;