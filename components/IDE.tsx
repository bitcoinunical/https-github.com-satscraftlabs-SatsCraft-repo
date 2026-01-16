import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';

interface IDEProps {
  initialCode: string;
  language: string;
  onRun: (code: string) => void;
  output: { type: 'success' | 'error' | 'info'; message: string } | null;
  isSuccess: boolean;
}

export const IDE: React.FC<IDEProps> = ({ initialCode, language, onRun, output, isSuccess }) => {
  const [code, setCode] = useState(initialCode);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset code when initialCode changes (new step)
  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const val = e.currentTarget.value;
      setCode(val.substring(0, start) + '  ' + val.substring(end));
      // Hacky cursor move for demo
      setTimeout(() => {
        if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // Simple syntax highlighting simulation
  const renderHighlightedCode = () => {
    let highlighted = code;
    
    // Bitcoin Script Highlighting
    if (language === 'bitcoin-script') {
        highlighted = highlighted.replace(/\b(OP_\w+)\b/g, '<span class="text-blue-400 font-bold">$1</span>'); // Opcodes
        highlighted = highlighted.replace(/<.*?>/g, '<span class="text-green-400">$1</span>'); // Data pushes
    }
    // INI / Config Highlighting
    else if (language === 'ini') {
        highlighted = highlighted.replace(/^\[(.*?)\]/gm, '<span class="text-yellow-400 font-bold">[$1]</span>'); // Sections
        highlighted = highlighted.replace(/^(.*?)=/gm, '<span class="text-blue-300">$1</span>='); // Keys
        highlighted = highlighted.replace(/=(.*?)$/gm, '=<span class="text-green-300">$1</span>'); // Values
        highlighted = highlighted.replace(/^#.*$/gm, '<span class="text-text-muted italic">$&</span>'); // Comments
    }
    // JSON Highlighting
    else if (language === 'json') {
        highlighted = highlighted.replace(/"(.*?)":/g, '<span class="text-blue-300">"$1"</span>:'); // Keys
        highlighted = highlighted.replace(/: "(.*?)"/g, ': <span class="text-green-300">"$1"</span>'); // String Values
        highlighted = highlighted.replace(/: (true|false|null|[0-9]+)/g, ': <span class="text-orange-400 font-bold">$1</span>'); // Booleans/Nums
    }

    return <div className="absolute inset-0 pointer-events-none p-4 whitespace-pre-wrap font-mono text-sm leading-6" dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  return (
    <div className="flex flex-col h-full bg-[#1E1E1E] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-black">
        <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-blue-400">code</span>
            <span className="text-xs text-text-muted font-mono">{language === 'ini' ? 'lnd.conf' : language === 'json' ? 'payload.json' : 'script.sig'}</span>
        </div>
        <div className="flex gap-1">
            <div className="size-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="size-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
            <div className="size-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 relative overflow-hidden group">
        {/* Line Numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#1E1E1E] border-r border-white/5 flex flex-col items-end pt-4 pr-2 text-text-muted/30 font-mono text-sm leading-6 select-none">
            {code.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>

        {/* Text Area (Transparent) */}
        <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="absolute left-10 right-0 top-0 bottom-0 p-4 bg-transparent text-transparent caret-white resize-none outline-none font-mono text-sm leading-6 z-10 w-[calc(100%-40px)]"
        />
        
        {/* Syntax Highlighter Layer (Visible) */}
        <div className="absolute left-10 right-0 top-0 bottom-0 text-white pointer-events-none">
            {renderHighlightedCode()}
        </div>
      </div>

      {/* Terminal / Output */}
      <div className="h-1/3 bg-[#0D0F12] border-t border-white/10 flex flex-col">
          <div className="px-4 py-1 bg-[#252526] flex items-center justify-between">
              <span className="text-[10px] font-bold text-text-muted uppercase">Terminal Output</span>
              {output && (
                  <span className={`text-[10px] font-bold ${output.type === 'success' ? 'text-success' : 'text-error'}`}>
                      exit code {output.type === 'success' ? '0' : '1'}
                  </span>
              )}
          </div>
          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto">
              {!output && <span className="text-text-muted opacity-50">$ Waiting for execution...</span>}
              {output && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <span className="text-text-muted select-none">$ ./verify_script</span>
                      <br/>
                      <span className={output.type === 'success' ? 'text-success' : output.type === 'error' ? 'text-error' : 'text-blue-400'}>
                        {output.message}
                      </span>
                  </div>
              )}
          </div>
          <div className="p-4 border-t border-white/5 bg-[#1E1E1E]">
             <Button 
                variant={isSuccess ? 'secondary' : 'primary'} 
                fullWidth 
                size="md" 
                onClick={() => onRun(code)}
                icon={isSuccess ? 'check' : 'play_arrow'}
                className={isSuccess ? 'bg-success/20 text-success border-success/50' : ''}
            >
                {isSuccess ? 'Verified' : 'Run Verification'}
            </Button>
          </div>
      </div>
    </div>
  );
};