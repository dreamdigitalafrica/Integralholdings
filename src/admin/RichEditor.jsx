import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Heading2, Undo2, Redo2, Link2 } from 'lucide-react';

export default function RichEditor({ value, onChange, label }) {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'Start writing…' })],
    content: value || '',
    editorProps: { attributes: { 'aria-label': label, role: 'textbox', 'aria-multiline': 'true' } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
  useEffect(() => {
    if (editor && (value || '') !== editor.getHTML()) editor.commands.setContent(value || '', { emitUpdate: false });
  }, [editor, value]);
  if (!editor) return null;
  const tools = [
    [Bold, 'Bold', 'bold', () => editor.chain().focus().toggleBold().run()],
    [Italic, 'Italic', 'italic', () => editor.chain().focus().toggleItalic().run()],
    [Heading2, 'Heading', 'heading', () => editor.chain().focus().toggleHeading({ level: 2 }).run()],
    [List, 'Bullet list', 'bulletList', () => editor.chain().focus().toggleBulletList().run()],
    [ListOrdered, 'Numbered list', 'orderedList', () => editor.chain().focus().toggleOrderedList().run()],
    [Link2, 'Insert link', 'link', () => { const url = window.prompt('Link URL (https://)', editor.getAttributes('link').href || ''); if (url === '') editor.chain().focus().unsetLink().run(); else if (url && /^https:\/\//i.test(url)) editor.chain().focus().setLink({ href: url }).run(); }],
    [Undo2, 'Undo', null, () => editor.chain().focus().undo().run()],
    [Redo2, 'Redo', null, () => editor.chain().focus().redo().run()],
  ];
  return <div className="cms-rich"><div className="cms-rich-tools">{tools.map(([Icon, title, active, action]) => <button type="button" key={title} title={title} aria-label={title} aria-pressed={active ? editor.isActive(active) : undefined} onClick={action}><Icon size={16} /></button>)}</div><EditorContent editor={editor} /></div>;
}
