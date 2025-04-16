import { useState } from 'react';

function FileUploader({ onFileUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  
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
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'text/xml' || droppedFile.name.endsWith('.xml'))) {
      setFile(droppedFile);
      readFile(droppedFile);
    } else if (droppedFile) {
      alert('Por favor, arrastra un archivo XML válido.');
    }
  };
  
  return (
    <div 
      className={`
        border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}
        ${file ? 'py-4 px-6' : 'p-8'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileInput').click()}
    >
      <input 
        type="file" 
        id="fileInput" 
        className="hidden" 
        accept=".xml,text/xml" 
        onChange={handleFileChange} 
      />
      
      {file ? (
        <div className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-success mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-success font-medium">
              Archivo cargado: <span className="font-bold">{file.name}</span>
            </p>
            <p className="text-sm text-gray-500">
              Tamaño: {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Arrastra y suelta tu archivo XML aquí
          </p>
          <p className="mt-1 text-sm text-gray-500">
            o haz clic para seleccionar un archivo
          </p>
        </div>
      )}
    </div>
  );
}

export default FileUploader;