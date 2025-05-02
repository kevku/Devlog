import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/PromptEditor.module.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  MdFormatBold, MdFormatItalic, MdFormatListBulleted, 
  MdFormatListNumbered, MdCode, MdLink, MdImage,
  MdFormatQuote, MdPreview, MdTitle
} from 'react-icons/md';

const PromptEditorPage = () => {
  const { promptId } = useParams();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const insertMarkdown = (type) => {
    const markdownSyntax = {
      bold: ['**', '**'],
      italic: ['_', '_'],
      heading: ['# ', ''],
      bullet: ['- ', ''],
      number: ['1. ', ''],
      code: ['```\n', '\n```'],
      link: ['[', '](url)'],
      image: ['![', '](image-url)'],
      quote: ['> ', '']
    };

    const textarea = document.getElementById('editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = content;
    
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);
    
    // If text is selected, wrap it in markdown syntax
    // If no text is selected, just insert markdown syntax
    const [prefix, suffix] = markdownSyntax[type];
    const newText = selection 
      ? before + prefix + selection + suffix + after
      : before + prefix + 'text' + suffix + after;
    
    setContent(newText);

    // Put cursor in the middle of the inserted text when no selection
    if (!selection) {
      const newCursorPos = start + prefix.length;
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos + 4);
      }, 0);
    }
  };

  return (
    <div className={styles.editorContainer}>
      <input 
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title..."
        className={styles.titleInput}
      />
      
      <div className={styles.toolbar}>
        <button onClick={() => insertMarkdown('heading')}><MdTitle /></button>
        <button onClick={() => insertMarkdown('bold')}><MdFormatBold /></button>
        <button onClick={() => insertMarkdown('italic')}><MdFormatItalic /></button>
        <div className={styles.divider} />
        <button onClick={() => insertMarkdown('bullet')}><MdFormatListBulleted /></button>
        <button onClick={() => insertMarkdown('number')}><MdFormatListNumbered /></button>
        <div className={styles.divider} />
        <button onClick={() => insertMarkdown('code')}><MdCode /></button>
        <button onClick={() => insertMarkdown('link')}><MdLink /></button>
        <button onClick={() => insertMarkdown('image')}><MdImage /></button>
        <button onClick={() => insertMarkdown('quote')}><MdFormatQuote /></button>
        <div className={styles.divider} />
        <button 
          onClick={() => setShowPreview(!showPreview)}
          className={`${styles.previewButton} ${showPreview ? styles.active : ''}`}
        >
          <MdPreview />
        </button>
      </div>

      <div className={`${styles.editorWrapper} ${showPreview ? styles.split : ''}`}>
        <textarea
          id="editor"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content here... (Markdown supported)"
          className={styles.editor}
        />
        {showPreview && (
          <div className={styles.preview}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptEditorPage;
