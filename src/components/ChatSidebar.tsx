import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Plus,
  LogIn,
  ChevronDown,
  Users,
  User,
  Settings,
  FileText,
  Bot,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  type: "group" | "private";
  lastMessage?: string;
  unread?: number;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

const ChatSidebar = ({ conversations, activeId, onSelect, onNew, onDelete }: ChatSidebarProps) => {
  const [groupOpen, setGroupOpen] = useState(true);
  const [privateOpen, setPrivateOpen] = useState(true);

  const groupConvos = conversations.filter((c) => c.type === "group");
  const privateConvos = conversations.filter((c) => c.type === "private");

  return (
    <div className="flex h-full w-[280px] flex-col bg-sidebar border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 neon-border">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          NYAN<span className="text-primary">-BOT</span>
        </h1>
      </div>

      {/* Nav Icons */}
      <div className="flex gap-1 px-4 pb-3">
        {[MessageSquare, FileText, Bot, Settings].map((Icon, i) => (
          <button
            key={i}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
              i === 0 ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 pb-4">
        <Button onClick={onNew} size="sm" className="flex-1 gap-2 bg-primary/20 text-primary hover:bg-primary/30 neon-border">
          <Plus className="h-4 w-4" /> New
        </Button>
        <Button size="sm" variant="outline" className="flex-1 gap-2 border-border text-muted-foreground hover:bg-secondary">
          <LogIn className="h-4 w-4" /> Join
        </Button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-3 scrollbar-thin">
        <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Conversations
        </p>

        {/* Group */}
        <button
          onClick={() => setGroupOpen(!groupOpen)}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-sidebar-foreground hover:bg-secondary transition-colors"
        >
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Group</span>
          <ChevronDown className={cn("ml-auto h-4 w-4 text-muted-foreground transition-transform", groupOpen && "rotate-180")} />
        </button>
        <AnimatePresence>
          {groupOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
              {groupConvos.length === 0 ? (
                <p className="py-2 pl-8 text-xs text-muted-foreground italic">-- Empty --</p>
              ) : (
                groupConvos.map((c) => (
                  <ConvoItem key={c.id} convo={c} active={c.id === activeId} onSelect={onSelect} onDelete={onDelete} />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Private */}
        <button
          onClick={() => setPrivateOpen(!privateOpen)}
          className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-sidebar-foreground hover:bg-secondary transition-colors"
        >
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Private</span>
          <ChevronDown className={cn("ml-auto h-4 w-4 text-muted-foreground transition-transform", privateOpen && "rotate-180")} />
        </button>
        <AnimatePresence>
          {privateOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
              {privateConvos.length === 0 ? (
                <p className="py-2 pl-8 text-xs text-muted-foreground italic">-- Empty --</p>
              ) : (
                privateConvos.map((c) => (
                  <ConvoItem key={c.id} convo={c} active={c.id === activeId} onSelect={onSelect} onDelete={onDelete} />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
            N
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-foreground truncate">Nyan User</p>
            <p className="text-xs text-muted-foreground truncate">user@nyanbot.ai</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

const ConvoItem = ({
  convo,
  active,
  onSelect,
  onDelete,
}: {
  convo: Conversation;
  active: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className={cn(
      "group ml-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors",
      active ? "bg-primary/15 text-primary neon-border" : "text-sidebar-foreground hover:bg-secondary"
    )}
    onClick={() => onSelect(convo.id)}
  >
    <MessageSquare className="h-3.5 w-3.5 shrink-0" />
    <span className="truncate flex-1">{convo.title}</span>
    {convo.unread && convo.unread > 0 && (
      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
        {convo.unread}
      </span>
    )}
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete(convo.id);
      }}
      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  </motion.div>
);

export default ChatSidebar;
