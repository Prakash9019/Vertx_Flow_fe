import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { createRoot } from 'react-dom/client';
import { Image, Palette, Plus, Layout } from 'lucide-react';
import A1 from "./1.jpg";
import A2 from "./2.jpg";
import A3 from "./3.jpg";
import A4 from "./4.jpg";
import A5 from "./5.jpg";
import A6 from "./6.jpg";
import A7 from "./7.jpg";
import A8 from "./8.jpg";
import A9 from "./9.jpg";
import A10 from "./10.jpg";
import A11 from "./11.jpg";
import A12 from "./12.jpg";
import A13 from "./13.jpg";
import A14 from "./14.jpg";
import A15 from "./15.jpg";
import A16 from "./16.jpg";
import A17 from "./17.jpg";
import A18 from "./18.jpg";
import A19 from "./19.jpg";
import A20 from "./20.jpg";
import A21 from "./21.jpg";
import A22 from "./22.jpg";
import A23 from "./23.jpg";
import B1 from "./1.png"
import B2 from "./24.jpg"
import B3 from "./25.jpg"
import C1 from "./26.jpg"
import B4 from "./2.png"

import { ImageIcon, Check } from 'lucide-react';
import { BiDockRight } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { IoPersonCircleOutline } from "react-icons/io5";
import { PiDotsThreeBold } from "react-icons/pi";

const images = [A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13, A14, A15, A16, A17, A18, A19, A20, A21, A22, A23];

// Theme classes
const themes = {
  dark: {
    bg: 'bg-[#021e1d]',
    text: 'text-white',
    card: 'bg-gradient-to-b from-black/70 from-35% via-white/30 via-129% to-black to-100%',
    accent: 'text-blue-400',
    border: 'border-gray-600'
  },
  light: {
    bg: 'bg-gray-100',
    text: 'text-gray-900',
    card: 'bg-gradient-to-b from-white/70 to-gray-200',
    accent: 'text-blue-600',
    border: 'border-gray-300'
  },
  warm: {
    bg: 'bg-orange-100',
    text: 'text-black',
    card: 'bg-gradient-to-b from-orange-200 to-orange-100',
    accent: 'text-orange-600',
    border: 'border-orange-300'
  },
};

const themes2 = {
  original: {
    name: 'Original',
    containerClass: 'bg-black',
    textClass: 'text-white',
    buttonBg: 'bg-gray-900',
    buttonText: 'text-white',
    modalBg: 'bg-gray-900',
    modalText: 'text-white',
    iconBorder: 'border-white',
    color: '#000000',
  },
  'dark-blue': {
    name: 'Dark Blue',
    containerClass: 'bg-blue-950',
    textClass: 'text-blue-200',
    buttonBg: 'bg-blue-950',
    buttonText: 'text-blue-200',
    modalBg: 'bg-blue-900',
    modalText: 'text-blue-200',
    iconBorder: 'border-blue-200',
    color: '#1e3a8a',
  },
  'light': {
    name: 'Light',
    containerClass: 'bg-gray-200',
    textClass: 'text-gray-800',
    buttonBg: 'bg-gray-200',
    buttonText: 'text-gray-800',
    modalBg: 'bg-gray-300',
    modalText: 'text-gray-800',
    iconBorder: 'border-gray-800',
    color: '#e5e7eb',
  },
  'deep-purple': {
    name: 'Deep Purple',
    containerClass: 'bg-purple-900',
    textClass: 'text-purple-200',
    buttonBg: 'bg-purple-900',
    buttonText: 'text-purple-200',
    modalBg: 'bg-purple-950',
    modalText: 'text-purple-200',
    iconBorder: 'border-purple-200',
    color: '#581c87',
  },
  'earth-tone': {
    name: 'Earth Tone',
    containerClass: 'bg-stone-800',
    textClass: 'text-stone-300',
    buttonBg: 'bg-stone-800',
    buttonText: 'text-stone-300',
    modalBg: 'bg-stone-900',
    modalText: 'text-stone-300',
    iconBorder: 'border-stone-300',
    color: '#44403c',
  },
};

// Comprehensive Layout Definitions - All Standard Presentation Layouts
const LAYOUT_DEFINITIONS = {
  title: {
    // Title Slide Layouts
    title_only: {
      name: 'Title Only',
      description: 'Large centered title',
      component: 'TitleOnlyLayout'
    },
    title_subtitle: {
      name: 'Title & Subtitle',
      description: 'Title with subtitle centered',
      component: 'TitleSubtitleLayout'
    },
    title_content: {
      name: 'Title & Content',
      description: 'Title with bullet points',
      component: 'TitleContentLayout'
    },
    section_header: {
      name: 'Section Header',
      description: 'Section divider slide',
      component: 'SectionHeaderLayout'
    }
  },
  content: {
    // Content Layouts
    content_with_caption: {
      name: 'Content with Caption',
      description: 'Title and content with caption',
      component: 'ContentCaptionLayout'
    },
    two_content: {
      name: 'Two Content',
      description: 'Side by side content blocks',
      component: 'TwoContentLayout'
    },
    comparison: {
      name: 'Comparison',
      description: 'Compare two items',
      component: 'ComparisonLayout'
    },
    content_over_image: {
      name: 'Content Over Image',
      description: 'Text overlay on image',
      component: 'ContentOverImageLayout'
    }
  },
  picture: {
    // Picture Layouts
    picture_with_caption: {
      name: 'Picture with Caption',
      description: 'Large image with caption',
      component: 'PictureCaptionLayout'
    },
    content_with_image: {
      name: 'Content with Image',
      description: 'Content alongside image',
      component: 'ContentImageLayout'
    },
    image_with_content: {
      name: 'Image with Content',
      description: 'Image with side content',
      component: 'ImageContentLayout'
    },
    two_content_with_image: {
      name: 'Two Content with Image',
      description: 'Split content with image',
      component: 'TwoContentImageLayout'
    }
  },
  diagram: {
    // Diagram and Process Layouts
    vertical_text: {
      name: 'Vertical Text',
      description: 'Vertical text layout',
      component: 'VerticalTextLayout'
    },
    vertical_title_text: {
      name: 'Vertical Title & Text',
      description: 'Vertical title with text',
      component: 'VerticalTitleTextLayout'
    },
    four_objects: {
      name: 'Four Objects',
      description: '2x2 grid layout',
      component: 'FourObjectsLayout'
    },
    title_four_objects: {
      name: 'Title & Four Objects',
      description: 'Title with 2x2 grid',
      component: 'TitleFourObjectsLayout'
    }
  },
  text: {
    // Text-heavy Layouts
    title_text: {
      name: 'Title & Text',
      description: 'Title with paragraph text',
      component: 'TitleTextLayout'
    },
    title_two_column_text: {
      name: 'Title & Two Column Text',
      description: 'Title with two text columns',
      component: 'TitleTwoColumnTextLayout'
    },
    blank: {
      name: 'Blank',
      description: 'Blank slide for custom content',
      component: 'BlankLayout'
    },
    quote: {
      name: 'Quote',
      description: 'Large quote with attribution',
      component: 'QuoteLayout'
    }
  }
};

// Layout Selector Component
const LayoutSelector = ({ slideType, currentLayout, onLayoutChange, onClose, theme }) => {
  const currentTheme = themes[theme];
  const layouts = LAYOUT_DEFINITIONS[slideType] || LAYOUT_DEFINITIONS.content;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
      <div className={`${currentTheme.card} rounded-lg p-6 shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto`}>
        <h2 className={`text-xl font-semibold mb-4 ${currentTheme.text}`}>Choose Layout</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(layouts).map(([key, layout]) => (
            <button
              key={key}
              onClick={() => onLayoutChange(key)}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentLayout === key 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded mb-2 flex items-center justify-center">
                <Layout size={20} className="text-gray-500" />
              </div>
              <h3 className={`font-medium text-sm ${currentTheme.text}`}>{layout.name}</h3>
              <p className={`text-xs opacity-60 ${currentTheme.text}`}>{layout.description}</p>
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Enhanced slide components with all professional layouts
const EnhancedSlide = ({ slideType, layout, theme, content, onContentChange }) => {
  const editorRef = useRef(null);
  const currentTheme = themes[theme];

  useEffect(() => {
    // Initialize Froala editor
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/css/froala_editor.pkgd.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/4.2.0/js/froala_editor.pkgd.min.js';
    
    const initializeEditor = () => {
      if (editorRef.current && window.FroalaEditor) {
        new window.FroalaEditor(editorRef.current, {
          inline: true,
          toolbarInline: true,
          toolbarButtons: {
            'moreText': {
                buttons: [
                    'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
                    'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'insertImage',
                    'align', 'quote', 'formatOL', 'formatUL', 'outdent', 'indent',
                    'insertLink', 'paragraphStyle', 'insertVideo', 'insertFile', 'insertTable',
                    'undo', 'redo', 'clearFormatting', 'selectAll', 'html'
                ],
                buttonsVisible: 12,
                align: 'center'
            }
          },
          imageEditButtons: ['imageDisplay', 'imageAlign', 'imageSize', 'imageRemove'],
          charCounterCount: false,
          wordCounterCount: false,
          toolbarVisibleWithoutSelection: true
        });
      }
    };

    script.onload = () => {
      setTimeout(initializeEditor, 100);
    };

    document.body.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const renderLayout = () => {
    switch (layout) {
      // TITLE LAYOUTS
      case 'title_only':
        return (
          <div className={`flex flex-col items-center justify-center h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`text-center max-w-6xl w-full`}>
              <div ref={editorRef} className="focus:outline-none">
                <h1 className="text-8xl md:text-9xl font-bold leading-tight" contentEditable suppressContentEditableWarning>
                  {content.title || 'Presentation Title'}
                </h1>
              </div>
            </div>
          </div>
        );

      case 'title_subtitle':
        return (
          <div className={`flex flex-col items-center justify-center h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`text-center max-w-6xl w-full ${currentTheme.card} p-12 rounded-2xl shadow-2xl`}>
              <div ref={editorRef} className="focus:outline-none">
                <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight" contentEditable suppressContentEditableWarning>
                  {content.title || 'Main Title'}
                </h1>
                <h2 className="text-2xl md:text-3xl opacity-80 font-light" contentEditable suppressContentEditableWarning>
                  {content.subtitle || 'Subtitle or tagline goes here'}
                </h2>
              </div>
            </div>
          </div>
        );

      case 'title_content':
        return (
          <div className={`flex flex-col h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`max-w-7xl w-full mx-auto ${currentTheme.card} p-10 rounded-2xl shadow-2xl h-full`}>
              <div ref={editorRef} className="focus:outline-none h-full flex flex-col">
                <h1 className="text-5xl md:text-6xl font-bold mb-12" contentEditable suppressContentEditableWarning>
                  {content.title || 'Title with Content'}
                </h1>
                <div className="text-xl md:text-2xl space-y-6 flex-1" contentEditable suppressContentEditableWarning>
                  <p>• First key point or bullet item</p>
                  <p>• Second important point</p>
                  <p>• Third essential item</p>
                  <p>• Final summary point</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'section_header':
        return (
          <div className={`flex flex-col items-center justify-center h-full p-10 ${currentTheme.bg} ${currentTheme.text} relative`}>
            <div className="absolute inset-0 opacity-10">
              <img src={B1} alt="Background" className="w-full h-full object-cover" />
            </div>
            <div className={`text-center max-w-4xl w-full z-10`}>
              <div ref={editorRef} className="focus:outline-none">
                <div className={`text-lg font-semibold mb-4 ${currentTheme.accent} tracking-widest uppercase`} contentEditable suppressContentEditableWarning>
                  Section 01
                </div>
                <h1 className="text-7xl md:text-8xl font-bold leading-tight mb-6" contentEditable suppressContentEditableWarning>
                  {content.title || 'Section Title'}
                </h1>
                <div className={`w-24 h-1 ${currentTheme.accent.replace('text-', 'bg-')} mx-auto`}></div>
              </div>
            </div>
          </div>
        );

      // CONTENT LAYOUTS
      case 'content_with_caption':
        return (
          <div className={`flex flex-col h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`max-w-7xl w-full mx-auto ${currentTheme.card} p-10 rounded-2xl shadow-2xl h-full flex flex-col`}>
              <div ref={editorRef} className="focus:outline-none flex-1 flex flex-col">
                <h1 className="text-4xl md:text-5xl font-bold mb-8" contentEditable suppressContentEditableWarning>
                  {content.title || 'Content with Caption'}
                </h1>
                <div className="text-lg md:text-xl leading-relaxed mb-8 flex-1" contentEditable suppressContentEditableWarning>
                  {content.content || 'This is the main content area where you can add detailed information, explanations, or any text content that supports your presentation. You can format this text and add multiple paragraphs as needed.'}
                </div>
                <div className={`text-sm ${currentTheme.accent} font-medium border-l-4 ${currentTheme.border} pl-4`} contentEditable suppressContentEditableWarning>
                  {content.caption || 'This is a caption or note that provides additional context or citation information.'}
                </div>
              </div>
            </div>
          </div>
        );

      case 'two_content':
        return (
          <div className={`flex flex-col h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`max-w-7xl w-full mx-auto ${currentTheme.card} p-10 rounded-2xl shadow-2xl h-full`}>
              <div ref={editorRef} className="focus:outline-none h-full flex flex-col">
                <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center" contentEditable suppressContentEditableWarning>
                  {content.title || 'Two Content Areas'}
                </h1>
                <div className="grid md:grid-cols-2 gap-12 flex-1">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-400" contentEditable suppressContentEditableWarning>
                      Left Content
                    </h2>
                    <div className="text-lg leading-relaxed" contentEditable suppressContentEditableWarning>
                      This is the left content area. You can add any information, bullet points, or detailed explanations here.
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold mb-4 text-green-400" contentEditable suppressContentEditableWarning>
                      Right Content
                    </h2>
                    <div className="text-lg leading-relaxed" contentEditable suppressContentEditableWarning>
                      This is the right content area. Perfect for comparisons, additional details, or complementary information.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'comparison':
        return (
          <div className={`flex flex-col h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`max-w-7xl w-full mx-auto h-full`}>
              <div ref={editorRef} className="focus:outline-none h-full flex flex-col">
                <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center" contentEditable suppressContentEditableWarning>
                  {content.title || 'Comparison'}
                </h1>
                <div className="grid md:grid-cols-2 gap-8 flex-1">
                  <div className={`${currentTheme.card} p-8 rounded-2xl shadow-xl h-full`}>
                    <h2 className="text-2xl font-bold mb-6 text-red-400" contentEditable suppressContentEditableWarning>
                      Option A
                    </h2>
                    <ul className="space-y-4 text-lg">
                      <li contentEditable suppressContentEditableWarning>• Feature 1</li>
                      <li contentEditable suppressContentEditableWarning>• Feature 2</li>
                      <li contentEditable suppressContentEditableWarning>• Feature 3</li>
                      <li contentEditable suppressContentEditableWarning>• Feature 4</li>
                    </ul>
                  </div>
                  <div className={`${currentTheme.card} p-8 rounded-2xl shadow-xl h-full`}>
                    <h2 className="text-2xl font-bold mb-6 text-blue-400" contentEditable suppressContentEditableWarning>
                      Option B
                    </h2>
                    <ul className="space-y-4 text-lg">
                      <li contentEditable suppressContentEditableWarning>• Feature 1</li>
                      <li contentEditable suppressContentEditableWarning>• Feature 2</li>
                      <li contentEditable suppressContentEditableWarning>• Feature 3</li>
                      <li contentEditable suppressContentEditableWarning>• Feature 4</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'content_over_image':
        return (
          <div className={`relative h-full ${currentTheme.bg} ${currentTheme.text}`}>
            <div className="absolute inset-0">
              <img src={A5} alt="Background" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
            <div className="relative z-10 flex flex-col justify-center h-full p-10">
              <div className="max-w-4xl">
                <div ref={editorRef} className="focus:outline-none">
                  <h1 className="text-5xl md:text-6xl font-bold mb-8 text-white" contentEditable suppressContentEditableWarning>
                    {content.title || 'Content Over Image'}
                  </h1>
                  <div className="text-xl md:text-2xl text-white leading-relaxed" contentEditable suppressContentEditableWarning>
                    {content.content || 'This layout places your content over a background image with an overlay for readability. Perfect for impactful statements or key messages.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // PICTURE LAYOUTS
      case 'picture_with_caption':
        return (
          <div className={`flex flex-col h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`max-w-7xl w-full mx-auto h-full flex flex-col`}>
              <div ref={editorRef} className="focus:outline-none h-full flex flex-col">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center" contentEditable suppressContentEditableWarning>
                  {content.title || 'Picture with Caption'}
                </h1>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <img src={B2} alt="Main content" className="max-h-[60vh] w-auto object-contain rounded-xl shadow-2xl mb-6" />
                  <p className="text-lg md:text-xl text-center max-w-3xl opacity-80" contentEditable suppressContentEditableWarning>
                    {content.caption || 'This is the caption that describes or explains the image above. You can provide context, attribution, or additional details here.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'content_with_image':
        return (
          <div className={`flex items-center h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center ${currentTheme.card} p-10 rounded-2xl shadow-2xl`}>
              <div ref={editorRef} className="focus:outline-none">
                <h1 className="text-4xl md:text-5xl font-bold mb-8" contentEditable suppressContentEditableWarning>
                  {content.title || 'Content with Image'}
                </h1>
                <div className="text-lg md:text-xl leading-relaxed space-y-4" contentEditable suppressContentEditableWarning>
                  <p>This layout combines text content with a supporting image. The content can include multiple paragraphs, bullet points, or any formatted text.</p>
                  <p>The image complements and supports the written content, creating a balanced and engaging slide layout.</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img src={B3} alt="Supporting content" className="w-full max-w-md h-auto object-cover rounded-xl shadow-lg" />
              </div>
            </div>
          </div>
        );

      case 'image_with_content':
        return (
          <div className={`flex items-center h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center ${currentTheme.card} p-10 rounded-2xl shadow-2xl`}>
              <div className="flex items-center justify-center">
                <img src={C1} alt="Main content" className="w-full max-w-md h-auto object-cover rounded-xl shadow-lg" />
              </div>
              <div ref={editorRef} className="focus:outline-none">
                <h1 className="text-4xl md:text-5xl font-bold mb-8" contentEditable suppressContentEditableWarning>
                  {content.title || 'Image with Content'}
                </h1>
                <div className="text-lg md:text-xl leading-relaxed space-y-4" contentEditable suppressContentEditableWarning>
                  <p>This layout places the image first, followed by supporting text content. Perfect when the image is the primary focus.</p>
                  <p>The text provides context, explanation, or additional details about the visual element.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'two_content_with_image':
        return (
          <div className={`flex flex-col h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`max-w-7xl w-full mx-auto ${currentTheme.card} p-10 rounded-2xl shadow-2xl h-full`}>
              <div ref={editorRef} className="focus:outline-none h-full flex flex-col">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center" contentEditable suppressContentEditableWarning>
                  {content.title || 'Two Content with Image'}
                </h1>
                <div className="grid lg:grid-cols-3 gap-8 flex-1">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4" contentEditable suppressContentEditableWarning>
                      First Content
                    </h2>
                    <div className="text-lg leading-relaxed" contentEditable suppressContentEditableWarning>
                      Content area one with supporting information and details.
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <img src={B4} alt="Central image" className="w-full h-auto max-h-80 object-cover rounded-xl shadow-lg" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4" contentEditable suppressContentEditableWarning>
                      Second Content
                    </h2>
                    <div className="text-lg leading-relaxed" contentEditable suppressContentEditableWarning>
                      Content area two with additional information and context.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // DIAGRAM LAYOUTS
      case 'vertical_text':
        return (
          <div className={`flex items-center justify-center h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`max-w-4xl w-full ${currentTheme.card} p-10 rounded-2xl shadow-2xl`}>
              <div ref={editorRef} className="focus:outline-none text-center space-y-8">
                <div className="space-y-6">
                  <div className="text-2xl font-semibold" contentEditable suppressContentEditableWarning>
                    First Point
                  </div>
                  <div className="text-2xl font-semibold" contentEditable suppressContentEditableWarning>
                    Second Point
                  </div>
                  <div className="text-2xl font-semibold" contentEditable suppressContentEditableWarning>
                    Third Point
                  </div>
                  <div className="text-2xl font-semibold" contentEditable suppressContentEditableWarning>
                    Fourth Point
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'vertical_title_text':
        return (
          <div className={`flex flex-col justify-center h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`max-w-4xl w-full mx-auto ${currentTheme.card} p-10 rounded-2xl shadow-2xl`}>
              <div ref={editorRef} className="focus:outline-none text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-12" contentEditable suppressContentEditableWarning>
                  {content.title || 'Vertical Layout Title'}
                </h1>
                <div className="space-y-8">
                  <div className="text-xl font-medium" contentEditable suppressContentEditableWarning>
                    First Item
                  </div>
                  <div className="text-xl font-medium" contentEditable suppressContentEditableWarning>
                    Second Item
                  </div>
                  <div className="text-xl font-medium" contentEditable suppressContentEditableWarning>
                    Third Item
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'four_objects':
        return (
          <div className={`flex items-center justify-center h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`max-w-6xl w-full`}>
              <div ref={editorRef} className="focus:outline-none">
                <div className="grid grid-cols-2 gap-8 h-full">
                  <div className={`${currentTheme.card} p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center`}>
                    <h3 className="text-2xl font-bold mb-4" contentEditable suppressContentEditableWarning>
                      Object 1
                    </h3>
                    <p className="text-lg opacity-80" contentEditable suppressContentEditableWarning>
                      Description or content for first object
                    </p>
                  </div>
                  <div className={`${currentTheme.card} p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center`}>
                    <h3 className="text-2xl font-bold mb-4" contentEditable suppressContentEditableWarning>
                      Object 2
                    </h3>
                    <p className="text-lg opacity-80" contentEditable suppressContentEditableWarning>
                      Description or content for second object
                    </p>
                  </div>
                  <div className={`${currentTheme.card} p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center`}>
                    <h3 className="text-2xl font-bold mb-4" contentEditable suppressContentEditableWarning>
                      Object 3
                    </h3>
                    <p className="text-lg opacity-80" contentEditable suppressContentEditableWarning>
                      Description or content for third object
                    </p>
                  </div>
                  <div className={`${currentTheme.card} p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center`}>
                    <h3 className="text-2xl font-bold mb-4" contentEditable suppressContentEditableWarning>
                      Object 4
                    </h3>
                    <p className="text-lg opacity-80" contentEditable suppressContentEditableWarning>
                      Description or content for fourth object
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'title_four_objects':
        return (
          <div className={`flex flex-col h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`max-w-6xl w-full mx-auto h-full`}>
              <div ref={editorRef} className="focus:outline-none h-full flex flex-col">
                <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center" contentEditable suppressContentEditableWarning>
                  {content.title || 'Title with Four Objects'}
                </h1>
                <div className="grid grid-cols-2 gap-6 flex-1">
                  <div className={`${currentTheme.card} p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center`}>
                    <h3 className="text-xl font-bold mb-3" contentEditable suppressContentEditableWarning>
                      Item 1
                    </h3>
                    <p className="text-base opacity-80" contentEditable suppressContentEditableWarning>
                      First item description
                    </p>
                  </div>
                  <div className={`${currentTheme.card} p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center`}>
                    <h3 className="text-xl font-bold mb-3" contentEditable suppressContentEditableWarning>
                      Item 2
                    </h3>
                    <p className="text-base opacity-80" contentEditable suppressContentEditableWarning>
                      Second item description
                    </p>
                  </div>
                  <div className={`${currentTheme.card} p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center`}>
                    <h3 className="text-xl font-bold mb-3" contentEditable suppressContentEditableWarning>
                      Item 3
                    </h3>
                    <p className="text-base opacity-80" contentEditable suppressContentEditableWarning>
                      Third item description
                    </p>
                  </div>
                  <div className={`${currentTheme.card} p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center`}>
                    <h3 className="text-xl font-bold mb-3" contentEditable suppressContentEditableWarning>
                      Item 4
                    </h3>
                    <p className="text-base opacity-80" contentEditable suppressContentEditableWarning>
                      Fourth item description
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // TEXT LAYOUTS
      case 'title_text':
        return (
          <div className={`flex flex-col h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`max-w-6xl w-full mx-auto ${currentTheme.card} p-10 rounded-2xl shadow-2xl h-full`}>
              <div ref={editorRef} className="focus:outline-none h-full flex flex-col">
                <h1 className="text-4xl md:text-5xl font-bold mb-10" contentEditable suppressContentEditableWarning>
                  {content.title || 'Title and Text'}
                </h1>
                <div className="text-lg md:text-xl leading-relaxed space-y-6 flex-1" contentEditable suppressContentEditableWarning>
                  <p>This layout is perfect for detailed explanations, long-form content, or comprehensive information that needs to be presented clearly.</p>
                  <p>You can include multiple paragraphs, format the text with different styles, and ensure your message is communicated effectively to your audience.</p>
                  <p>The layout maintains good typography and readability while giving you plenty of space for your content.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'title_two_column_text':
        return (
          <div className={`flex flex-col h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`max-w-7xl w-full mx-auto ${currentTheme.card} p-10 rounded-2xl shadow-2xl h-full`}>
              <div ref={editorRef} className="focus:outline-none h-full flex flex-col">
                <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center" contentEditable suppressContentEditableWarning>
                  {content.title || 'Title with Two Column Text'}
                </h1>
                <div className="grid md:grid-cols-2 gap-12 flex-1">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-4" contentEditable suppressContentEditableWarning>
                      Left Column
                    </h2>
                    <div className="text-lg leading-relaxed space-y-4" contentEditable suppressContentEditableWarning>
                      <p>This is the left column content. Perfect for presenting information in a structured, easy-to-scan format.</p>
                      <p>You can add multiple paragraphs, bullet points, or any content that supports your presentation.</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-4" contentEditable suppressContentEditableWarning>
                      Right Column
                    </h2>
                    <div className="text-lg leading-relaxed space-y-4" contentEditable suppressContentEditableWarning>
                      <p>This is the right column content. Ideal for comparisons, additional details, or complementary information.</p>
                      <p>The two-column layout helps organize information and makes it easier for your audience to follow.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'blank':
        return (
          <div className={`h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`max-w-7xl w-full mx-auto h-full ${currentTheme.card} rounded-2xl shadow-2xl p-10`}>
              <div ref={editorRef} className="focus:outline-none h-full flex items-center justify-center">
                <div className="text-center text-xl opacity-50" contentEditable suppressContentEditableWarning>
                  Click to add content...
                </div>
              </div>
            </div>
          </div>
        );

      case 'quote':
        return (
          <div className={`flex items-center justify-center h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`max-w-5xl w-full ${currentTheme.card} p-12 rounded-2xl shadow-2xl text-center`}>
              <div ref={editorRef} className="focus:outline-none">
                <div className={`text-6xl ${currentTheme.accent} mb-6`}>"</div>
                <blockquote className="text-3xl md:text-4xl font-light italic mb-8 leading-relaxed" contentEditable suppressContentEditableWarning>
                  {content.quote || 'Your inspirational quote goes here. Make it meaningful and impactful.'}
                </blockquote>
                <div className="text-xl opacity-70" contentEditable suppressContentEditableWarning>
                  — {content.author || 'Quote Author'}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className={`flex flex-col items-center justify-center h-full p-10 ${currentTheme.bg} ${currentTheme.text}`}>
            <div className={`max-w-4xl ${currentTheme.card} p-8 rounded-lg shadow-2xl`}>
              <div ref={editorRef} className="focus:outline-none">
                <h1 className="text-6xl font-bold mb-6" contentEditable suppressContentEditableWarning>
                  {content.title || 'Default Layout'}
                </h1>
                <p className="text-xl opacity-80" contentEditable suppressContentEditableWarning>
                  {content.subtitle || 'Your content here'}
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderLayout();
};

// Original UserBGselect component (unchanged)
const UserBGselect = () => {
  const [backgroundImage, setBackgroundImage] = useState(images[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textPosition, setTextPosition] = useState('center');
  const [glowEffect, setGlowEffect] = useState(false);
  const [isNoCover, setIsNoCover] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(['Original']);
  const [selectedTheme, setSelectedTheme] = useState('original');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const handleImageClick = (image) => {
    setBackgroundImage(image);
    setIsModalOpen(false);
    setIsNoCover(false);
  };
  
  const navigate = useNavigate();
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOptionClick = (option) => {
    setSelectedOptions(prevSelected => {
      if (prevSelected.includes(option)) {
        const newSelected = prevSelected.filter(item => item !== option);
        return newSelected.length > 0 ? newSelected : ['Original'];
      } else {
        if (prevSelected.length < 1) {
          return [...prevSelected, option];
        }
        return [...prevSelected.slice(1), option];
      }
    });
    setIsMenuOpen(false);
  };

  const handleThemeClick = (themeKey) => {
    setSelectedTheme(themeKey);
    setIsThemeModalOpen(false);
  };

  useEffect(() => {
    let newTextPosition = 'center';
    let newGlowEffect = false;
    let newIsNoCover = false;

    if (selectedOptions.includes('Top')) {
      newTextPosition = 'top-left';
    }

    if (selectedOptions.includes('Center Glow')) {
      newGlowEffect = true;
    }

    if (selectedOptions.includes('No Cover')) {
      newIsNoCover = true;
    }

    setTextPosition(newTextPosition);
    setGlowEffect(newGlowEffect);
    setIsNoCover(newIsNoCover);
  }, [selectedOptions]);

  const currentTheme = themes2[selectedTheme];

  return (
    <div
      className={`h-screen w-screen bg-center transition-all duration-500 relative ${isNoCover ? currentTheme.containerClass : 'bg-cover'}`}
      style={{ backgroundImage: isNoCover ? 'none' : `url(${backgroundImage})` }}
    >
      <div
        className={`${currentTheme.textClass} text-center p-4  mx-auto transition-all duration-500 relative
          ${textPosition === 'top-left' ? 'absolute top-10 left-10' : 'flex flex-col justify-center items-center h-full w-full'}`}
      >
        <h2 className={`xl:text-7xl max-w-5xl lg:text-5xl md:text-4xl sm:text-3xl text-2xl font-[inter] font-semibold`}>
          Vertx: Pioneering Deeptech Innovation
        </h2>
        <h2 className={`xl:text-xl max-w-5xl lg:text-[19px] md:text-lg sm:text-base text-sm  mt-10 font-[inter]`}>
          Transforming The Future Through Breakthrough Technology
        </h2>
        {glowEffect && (
          <div className="w-full absolute bottom-0 left-0 glowing-text-bottom"></div>
        )}
      </div>
      
      <div className="absolute top-2 left-2 flex">
        <button
          onClick={() => navigate(-1)}
          className={`py-2 px-4 text-base font-[inter] font-semibold cursor-pointer rounded-l-xl border-none ${currentTheme.buttonBg} bg-opacity-50 ${currentTheme.buttonText} hover:bg-opacity-70 transition-colors`}
        >
          <BiDockRight size={24} />
        </button>
        <button
          className={`pr-3 text-sm cursor-pointer font-[inter] font-semibold rounded-r-xl border-none ${currentTheme.buttonBg} bg-opacity-50 ${currentTheme.buttonText} hover:bg-opacity-70 transition-colors flex items-center`}
        >
            <span>Vertx: Pioneering Deeptech Innovation</span>
        </button>
      </div>

      <div className="absolute top-2 right-2 flex">
        <button
          onClick={() => navigate()}
          className={`py-2 px-2 text-base font-[inter] font-semibold cursor-pointer rounded-l-xl border-none ${currentTheme.buttonBg} bg-opacity-50 ${currentTheme.buttonText} hover:bg-opacity-70 transition-colors`}
        >
          <IoPersonCircleOutline size={24} />
        </button>
        <button
          className={`px-2 text-sm cursor-pointer font-[inter] font-semibold border-none ${currentTheme.buttonBg} bg-opacity-50 ${currentTheme.buttonText} hover:bg-opacity-70 transition-colors flex items-center`}
        >
            <span>Share</span>
        </button>
        <button
          className={`px-2 text-sm cursor-pointer font-[inter] font-semibold border-none ${currentTheme.buttonBg} bg-opacity-50 ${currentTheme.buttonText} hover:bg-opacity-70 transition-colors flex items-center`}
        >
            <span>Present</span>
        </button>
        <button
          onClick={() => navigate()}
          className={`py-2 px-2 text-base font-[inter] font-extrabold cursor-pointer rounded-r-xl border-none ${currentTheme.buttonBg} bg-opacity-50 ${currentTheme.buttonText} hover:bg-opacity-70 transition-colors`}
        >
          <PiDotsThreeBold size={24} />
        </button>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex ">
        <button
          onClick={() => setIsModalOpen(true)}
          className={`py-2 px-4 text-base font-[inter] font-semibold cursor-pointer rounded-l-xl border-none ${currentTheme.buttonBg} bg-opacity-50 ${currentTheme.buttonText} hover:bg-opacity-70 transition-colors`}
        >
          <ImageIcon size={24} />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`py-3 px-4 text-sm font-[inter] font-semibold cursor-pointer border-none ${currentTheme.buttonBg} bg-opacity-50 ${currentTheme.buttonText} hover:bg-opacity-70 transition-colors`}
          >
            {selectedOptions.join(' & ')}
          </button>

          {isMenuOpen && (
            <div className={`absolute bottom-full mb-2 w-40 ${currentTheme.buttonBg} bg-opacity-75 ${currentTheme.buttonText} rounded-lg shadow-lg overflow-hidden`}>
              {['Original', 'Center Glow', 'Top', 'No Cover'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-400 transition-colors ${
                    selectedOptions.includes(option) ? 'bg-gray-500 brightness-150' : ''
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setIsThemeModalOpen(true)}
          className={` px-4 text-sm cursor-pointer font-[inter] font-semibold rounded-r-xl border-none ${currentTheme.buttonBg} bg-opacity-50 ${currentTheme.buttonText} hover:bg-opacity-70 transition-colors flex items-center`}
        >
          <Palette size={20} className="mr-2" />
            <span>{currentTheme.name === 'Original' ? 'Select Theme' : currentTheme.name}</span>
        </button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-opacity-75 backdrop-blur-md z-50"
          onClick={closeModal}
        >
          <div
            className={`${currentTheme.modalBg} p-6 rounded-lg shadow-2xl max-w-4xl max-h-[80vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 justify-center">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Background option ${index + 1}`}
                  onClick={() => handleImageClick(img)}
                  className={`aspect-square object-cover cursor-pointer rounded-md border-4 transition-all duration-300
                    ${backgroundImage === img ? 'border-blue-500 scale-105' : 'border-transparent hover:border-gray-300'}`}
                />
              ))}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 py-2 px-4 text-sm cursor-pointer rounded-md border-none bg-red-500 text-white float-right hover:bg-red-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isThemeModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={() => setIsThemeModalOpen(false)}
        >
          <div
            className={`${currentTheme.modalBg} ${currentTheme.modalText} p-4 rounded-lg shadow-2xl w-full max-w-sm`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Change document theme</h3>
            <div className="space-y-2">
              {Object.keys(themes2).map((themeKey) => (
                <button
                  key={themeKey}
                  onClick={() => handleThemeClick(themeKey)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors
                    ${selectedTheme === themeKey ? 'bg-gray-500' : 'hover:bg-gray-400'}`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${themes2[themeKey].modalBg} ${themes2[themeKey].textClass}`}
                    >
                      <span className="font-bold text-xl">Aa</span>
                    </span>
                    <span className="font-medium">{themes2[themeKey].name}</span>
                  </div>
                  {selectedTheme === themeKey && (
                    <Check size={20} className="text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Editor Component with all layouts
export default function EditorPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  
  // Comprehensive slide data with all professional layouts
  const [slideData, setSlideData] = useState([
    // Title slides
    { type: 'title', layout: 'title_only', content: { title: 'Main Presentation Title' } },
    { type: 'title', layout: 'title_subtitle', content: { title: 'Welcome', subtitle: 'Subtitle goes here' } },
    { type: 'title', layout: 'section_header', content: { title: 'Section One' } },
    
    // Content slides
    { type: 'content', layout: 'content_with_caption', content: { title: 'Key Information', content: 'Main content', caption: 'Additional notes' } },
    { type: 'content', layout: 'two_content', content: { title: 'Comparison View' } },
    { type: 'content', layout: 'comparison', content: { title: 'Compare Options' } },
    { type: 'content', layout: 'content_over_image', content: { title: 'Impactful Message' } },
    
    // Picture slides
    { type: 'picture', layout: 'picture_with_caption', content: { title: 'Visual Content' } },
    { type: 'picture', layout: 'content_with_image', content: { title: 'Content & Image' } },
    { type: 'picture', layout: 'image_with_content', content: { title: 'Image Focus' } },
    
    // Diagram slides
    { type: 'diagram', layout: 'four_objects', content: { title: 'Four Key Points' } },
    { type: 'diagram', layout: 'vertical_text', content: {} },
    { type: 'diagram', layout: 'title_four_objects', content: { title: 'Organized Content' } },
    
    // Text slides
    { type: 'text', layout: 'title_text', content: { title: 'Detailed Information' } },
    { type: 'text', layout: 'title_two_column_text', content: { title: 'Two Column Layout' } },
    { type: 'text', layout: 'quote', content: { quote: 'Inspiring quote here', author: 'Author Name' } },
    { type: 'text', layout: 'blank', content: {} },
  ]);

  const initialSlides = [
    <UserBGselect key="user-bg-select" />,
    ...slideData.map((slide, index) => (
      <EnhancedSlide 
        key={`slide-${index}`}
        slideType={slide.type}
        layout={slide.layout}
        theme={theme}
        content={slide.content}
        onContentChange={(newContent) => {
          setSlideData(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], content: newContent };
            return updated;
          });
        }}
      />
    ))
  ];

  const [slides, setSlides] = useState(initialSlides);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    // Update slides when theme or slide data changes
    const updatedSlides = [
      <UserBGselect key="user-bg-select" />,
      ...slideData.map((slide, index) => (
        <EnhancedSlide 
          key={`slide-${index}`}
          slideType={slide.type}
          layout={slide.layout}
          theme={theme}
          content={slide.content}
          onContentChange={(newContent) => {
            setSlideData(prev => {
              const updated = [...prev];
              updated[index] = { ...updated[index], content: newContent };
              return updated;
            });
          }}
        />
      ))
    ];
    setSlides(updatedSlides);
  }, [theme, slideData]);

  const handleAddSlide = () => {
    const newSlideData = {
      type: 'content',
      layout: 'title_text',
      content: { title: 'New Slide', subtitle: 'Add your content here' }
    };
    setSlideData(prev => [...prev, newSlideData]);
    setCurrentSlideIndex(slideData.length + 1); // +1 for UserBGselect
  };

  const handleLayoutChange = (newLayout) => {
    if (currentSlideIndex > 0) {
      const slideIndex = currentSlideIndex - 1; // -1 for UserBGselect
      setSlideData(prev => {
        const updated = [...prev];
        if (updated[slideIndex]) {
          updated[slideIndex] = { ...updated[slideIndex], layout: newLayout };
        }
        return updated;
      });
    }
    setShowLayoutModal(false);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setShowThemeModal(false);
  };

  useEffect(() => {
    const handleWheel = (event) => {
      if (isAnimatingRef.current) return;
      
      const deltaY = event.deltaY;
      let newIndex = currentSlideIndex;

      if (deltaY > 0 && currentSlideIndex < slides.length - 1) {
        newIndex = currentSlideIndex + 1;
      } else if (deltaY < 0 && currentSlideIndex > 0) {
        newIndex = currentSlideIndex - 1;
      }

      if (newIndex !== currentSlideIndex) {
        isAnimatingRef.current = true;
        setCurrentSlideIndex(newIndex);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentSlideIndex, slides.length]);

  const transition = {
    duration: 1.1,
    ease: [0.8, 0.08, -0.015, 1.0],
  };

  const containerVariants = {
    initial: { y: 0 },
    animate: { y: `-${currentSlideIndex * 100}vh` },
  };

  const getCurrentSlideType = () => {
    if (currentSlideIndex === 0) return 'title';
    const slideIndex = currentSlideIndex - 1;
    return slideData[slideIndex]?.type || 'content';
  };

  const getCurrentLayout = () => {
    if (currentSlideIndex === 0) return 'title_subtitle';
    const slideIndex = currentSlideIndex - 1;
    return slideData[slideIndex]?.layout || 'title_text';
  };

  return (
    <div className={`App font-sans antialiased h-screen w-screen relative overflow-hidden ${themes[theme].bg} ${themes[theme].text}`}>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        transition={transition}
        onAnimationComplete={() => { isAnimatingRef.current = false; }}
      >
        {slides.map((slide, index) => (
          <div key={slide.key || index} className="h-screen w-screen">
            {slide}
          </div>
        ))}
      </motion.div>

      {/* Slide Navigation Bars */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 flex flex-col space-y-4 z-50">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`
              h-0.5 rounded-full transition-all duration-300 ease-in-out cursor-pointer
              ${index === currentSlideIndex ? 'w-7 bg-gray-400' : 'w-3 bg-gray-500'}
            `}
            onClick={() => setCurrentSlideIndex(index)}
          ></div>
        ))}
      </div>

      {/* Control Buttons */}
      {currentSlideIndex > 0 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex z-50">
          <button
            onClick={handleAddSlide}
            className={`py-2 px-4 text-base font-[inter] font-semibold cursor-pointer rounded-l-xl border-none bg-gray-700 flex items-center bg-opacity-50 text-white hover:bg-opacity-70 transition-colors`}
          >
            <Plus size={20} className='mr-2'/> Add
          </button>

          <button
            onClick={() => setShowLayoutModal(true)}
            className={`px-4 py-3 text-sm cursor-pointer font-[inter] font-semibold border-none bg-gray-700 bg-opacity-50 text-white hover:bg-opacity-70 transition-colors flex items-center`}
          >
            <Layout size={20} className="mr-2" />
            <span>Layout</span>
          </button>

          <button
            onClick={() => setShowThemeModal(true)}
            className={`px-4 py-3 text-sm cursor-pointer font-[inter] font-semibold rounded-r-xl border-none bg-gray-700 bg-opacity-50 text-white hover:bg-opacity-70 transition-colors flex items-center`}
          >
            <Palette size={20} className="mr-2" />
            <span>Theme</span>
          </button>
        </div>
      )}

      {/* Theme Selection Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Choose a Theme</h2>
            <div className="flex gap-4">
              <button
                onClick={() => handleThemeChange('dark')}
                className="flex flex-col items-center justify-center p-4 rounded-md w-32 h-32 bg-[#021e1d] border-2 border-transparent hover:border-blue-500 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gray-600 mb-2"></div>
                <span className="text-white font-medium">Dark</span>
              </button>
              <button
                onClick={() => handleThemeChange('light')}
                className="flex flex-col items-center justify-center p-4 rounded-md w-32 h-32 bg-gray-100 border-2 border-transparent hover:border-blue-500 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gray-400 mb-2"></div>
                <span className="text-gray-900 font-medium">Light</span>
              </button>
              <button
                onClick={() => handleThemeChange('warm')}
                className="flex flex-col items-center justify-center p-4 rounded-md w-32 h-32 bg-orange-100 border-2 border-transparent hover:border-blue-500 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-orange-300 mb-2"></div>
                <span className="text-gray-900 font-medium">Warm</span>
              </button>
            </div>
            <button
              onClick={() => setShowThemeModal(false)}
              className="mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Layout Selection Modal */}
      {showLayoutModal && (
        <LayoutSelector
          slideType={getCurrentSlideType()}
          currentLayout={getCurrentLayout()}
          onLayoutChange={handleLayoutChange}
          onClose={() => setShowLayoutModal(false)}
          theme={theme}
        />
      )}
    </div>
  );
}