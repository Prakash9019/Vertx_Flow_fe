import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// The root App component.
const TheChallangePage = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    // Dynamically load the Froala CSS and JS files from CDN
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';
    
    // Add a delay to ensure the script is fully loaded and processed
    const initializeEditor = () => {
      if (editorRef.current && window.FroalaEditor) {
        new window.FroalaEditor(editorRef.current, {
          inline: true,
          toolbarInline: true, // This option ensures the toolbar is always inline
          toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'quote', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'],
          imageEditButtons: ['imageDisplay', 'imageAlign', 'imageSize', 'imageRemove'], // This option ensures the image editing toolbar
        });
      }
    };

    script.onload = () => {
      // Small delay to ensure all assets are ready before initialization
      setTimeout(initializeEditor, 100);
    };

    document.body.appendChild(script);

    // Cleanup function to remove dynamically added files and destroy the editor
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
      if (editorRef.current && editorRef.current.editor) {
        editorRef.current.editor.destroy();
      }
    };
  }, []);

  return (
    <div className="p-10 font-sans min-h-screen max-h-screen overflow-hidden bg-teal-950 text-white">
      <h1 className="text-4xl font-bold mb-4">
        The Challenge Page
      </h1>
      <div
        ref={editorRef}
        className="prose max-w-none focus:outline-none"
      >
        <h2>Welcome to the Editable Page</h2>
        <p>This paragraph is fully editable. Click on me to change the text, apply formatting like <strong>bold</strong> or <em>italic</em>, or add a link. You can also add more content below or above this text.</p>
        <p>This editor also supports images. You can resize this image by clicking on it and dragging the corners. You can also replace it or remove it.</p>
        <img 
          src="https://placehold.co/600x400/FF5733/ffffff?text=Editable+Image"
          alt="Placeholder image for editing"
          className="my-4 rounded-md shadow-lg"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        <p>Feel free to experiment with the different editing options.</p>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<TheChallangePage />);

export default TheChallangePage;