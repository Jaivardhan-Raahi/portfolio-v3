import React from 'react';
import { WindowState, AppDefinition } from '../types';
import { Icon } from './Icon';

interface WindowProps {
  win: WindowState;
  appDef: AppDefinition;
  isFocused: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onResizeStart: (e: React.MouseEvent, direction: string) => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  win,
  appDef,
  isFocused,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onDragStart,
  onResizeStart,
  children
}) => {
  return (
    <div
      onMouseDown={onFocus}
      style={{
        zIndex: win.zIndex,
        transform: win.isMaximized
          ? 'none'
          : `translate3d(${win.position.x}px, ${win.position.y}px, 0)`,
        width: win.isMaximized ? '100%' : `${win.size.width}px`,
        height: win.isMaximized ? 'calc(100% - 48px)' : `${win.size.height}px`,
        top: 0,
        left: 0,
        position: 'absolute'
      }}
      className={`flex flex-col rounded-xl overflow-hidden os-window-shadow border transition-shadow duration-150 ${
        win.isMaximized ? 'rounded-none' : ''
      } ${
        isFocused
          ? 'os-window-active border-sky-500/40 bg-os-surface/95 backdrop-blur-xl ring-1 ring-sky-500/20'
          : 'border-os-border/80 bg-os-surface/85 backdrop-blur-md opacity-95'
      }`}
    >
      {!win.isMaximized && (
        <>
          <div className="resize-handle resize-n" onMouseDown={(e) => onResizeStart(e, 'n')} />
          <div className="resize-handle resize-s" onMouseDown={(e) => onResizeStart(e, 's')} />
          <div className="resize-handle resize-e" onMouseDown={(e) => onResizeStart(e, 'e')} />
          <div className="resize-handle resize-w" onMouseDown={(e) => onResizeStart(e, 'w')} />
          <div className="resize-handle resize-ne" onMouseDown={(e) => onResizeStart(e, 'ne')} />
          <div className="resize-handle resize-nw" onMouseDown={(e) => onResizeStart(e, 'nw')} />
          <div className="resize-handle resize-se" onMouseDown={(e) => onResizeStart(e, 'se')} />
          <div className="resize-handle resize-sw" onMouseDown={(e) => onResizeStart(e, 'sw')} />
        </>
      )}

      <div
        onMouseDown={onDragStart}
        onDoubleClick={onMaximize}
        className={`h-10 px-4 flex items-center justify-between border-b cursor-default select-none ${
          isFocused
            ? 'bg-os-panel border-os-border text-slate-200'
            : 'bg-os-surface border-os-border/50 text-os-muted'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate font-medium text-xs">
          <Icon name={appDef.icon} className={`w-4 h-4 ${isFocused ? 'text-sky-400' : 'text-os-muted'}`} />
          <span className="truncate">{appDef.title}</span>
          <span className="text-[10px] font-mono text-os-muted border-l border-os-border pl-2">
            {appDef.category}
          </span>
        </div>

        <div className="flex items-center gap-1.5 window-control-btn">
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-os-muted hover:text-white transition-colors"
            title="Minimize"
          >
            <Icon name="Minus" className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize(); }}
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-os-muted hover:text-white transition-colors"
            title={win.isMaximized ? "Restore" : "Maximize"}
          >
            <Icon name={win.isMaximized ? "Minimize2" : "Square"} className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-7 h-7 rounded-lg hover:bg-rose-500/80 hover:text-white flex items-center justify-center text-os-muted transition-colors"
            title="Close"
          >
            <Icon name="X" className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-drag relative bg-os-bg/95">
        {children}
      </div>
    </div>
  );
};
