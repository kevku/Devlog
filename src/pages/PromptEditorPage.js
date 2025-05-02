import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/PromptEditor.module.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  MdFormatBold, MdFormatItalic, MdFormatListBulleted, 
  MdFormatListNumbered, MdCode, MdLink, MdImage,
  MdFormatQuote, MdPreview, MdTitle, MdArrowBack,
  MdFullscreen // Add this import
} from 'react-icons/md';

const PromptEditorPage = () => {
  const { promptId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showPreviewOnly, setShowPreviewOnly] = useState(false);
  const [lastListType, setLastListType] = useState(null);
  const [lastListTime, setLastListTime] = useState(0);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cursorPos = e.target.selectionStart;
      const textBeforeCursor = content.substring(0, cursorPos);
      const textAfterCursor = content.substring(cursorPos);
      
      // Check if the current line starts with a list marker
      const lastLine = textBeforeCursor.split('\n').pop();
      const bulletMatch = lastLine.match(/^(\s*)-\s+/);
      const numberMatch = lastLine.match(/^(\s*)\d+\.\s+/);
      
      if (bulletMatch || numberMatch) {
        e.preventDefault();
        // If the line is empty except for the marker, remove the marker
        if (lastLine.trim() === (bulletMatch?.[0] || numberMatch?.[0])?.trim()) {
          const newText = textBeforeCursor.substring(0, textBeforeCursor.length - lastLine.length) + textAfterCursor;
          setContent(newText);
          return;
        }
        
        const indent = (bulletMatch || numberMatch)[1];
        const marker = bulletMatch ? `${indent}- ` : 
          `${indent}${parseInt(numberMatch[0]) + 1}. `;
        
        const newText = textBeforeCursor + '\n' + marker + textAfterCursor;
        setContent(newText);
        
        // Move cursor after the new marker
        setTimeout(() => {
          const newPos = cursorPos + 1 + marker.length;
          e.target.setSelectionRange(newPos, newPos);
        }, 0);
      }
    }
  };

  // Add this helper function
  const updateScrollPosition = (textarea, cursorPosition) => {
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const totalLines = textarea.value.substr(0, cursorPosition).split('\n').length;
    const scrollPosition = (totalLines * lineHeight) - (textarea.clientHeight / 2);
    textarea.scrollTop = Math.max(0, scrollPosition);
  };

  const insertMarkdown = (type) => {
    const markdownSyntax = {
      bold: ['**', '**'],
      italic: ['_', '_'],
      heading: ['# ', ''],
      bullet: ['- ', ''], // Ensure there's a space after the dash
      number: ['1. ', ''],
      code: ['```\n', '\n```'],
      link: ['[', '](url)'],
      image: ['![', '](image-url)'],
      quote: ['> ', '']
    };

    // Handle list type switching
    if ((type === 'bullet' || type === 'number') && 
        (Date.now() - lastListTime < 1000) && 
        lastListType !== type && 
        (lastListType === 'bullet' || lastListType === 'number')) {
      // Convert existing list
      const lines = content.split('\n');
      const newContent = lines.map(line => {
        if (type === 'bullet' && line.match(/^\d+\.\s/)) {
          return line.replace(/^\d+\.\s/, '- ');
        } else if (type === 'number' && line.match(/^-\s/)) {
          const index = lines.indexOf(line) + 1;
          return line.replace(/^-\s/, `${index}. `);
        }
        return line;
      }).join('\n');
      
      setContent(newContent);
      setLastListType(type);
      setLastListTime(Date.now());
      return;
    }

    // Normal markdown insertion
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
        updateScrollPosition(textarea, newCursorPos);
      }, 0);
    } else {
      // When there is a selection, move cursor to the end of the inserted content
      const newCursorPos = start + prefix.length + selection.length + suffix.length;
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        updateScrollPosition(textarea, newCursorPos);
      }, 0);
    }

    // Update list tracking
    if (type === 'bullet' || type === 'number') {
      setLastListType(type);
      setLastListTime(Date.now());
    } else {
      setLastListType(null);
    }
  };

  const preprocessMarkdown = (text) => {
    // Fix bullet points that don't have proper spacing and ensure proper line breaks
    return text
      .replace(/^-(?!\s)/gm, '- ') // Add space after dash if missing
      .replace(/^(\s*)-\s*([^\n]*)$/gm, '$1- $2') // Fix any malformed bullet points
      .replace(/\n-\s/g, '\n- '); // Ensure proper line break before bullets
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.header}>
        <button 
          onClick={handleBack} 
          className={styles.backButton}
          title="Back to Dashboard"
        >
          <MdArrowBack />
        </button>
        <input 
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title..."
          className={styles.titleInput}
        />
      </div>
      
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
          onClick={() => {
            setShowPreview(!showPreview);
            if (showPreviewOnly) {
              setShowPreviewOnly(false);
            }
          }}
          data-active={showPreview}
          title="Side-by-side preview"
        >
          <MdPreview />
        </button>
        <button 
          onClick={() => {
            setShowPreviewOnly(!showPreviewOnly);
            setShowPreview(false);
          }}
          data-active={showPreviewOnly}
          title="Full screen preview"
        >
          <MdFullscreen />
        </button>
      </div>

      <div className={`${styles.editorWrapper} ${showPreview ? styles.split : ''}`}>
        <div className={`${styles.previewOnly} ${showPreviewOnly ? styles.active : ''}`}>
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
            {preprocessMarkdown(content)}
          </ReactMarkdown>
        </div>
        <textarea
          id="editor"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write your content here... (Markdown supported)"
          className={styles.editor}
          style={{ display: showPreviewOnly ? 'none' : 'block' }}
        />
        {showPreview && !showPreviewOnly && (
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
              {preprocessMarkdown(content)}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptEditorPage;
