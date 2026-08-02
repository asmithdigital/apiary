import ReactLib, { useState, useEffect, useMemo, useRef } from "https://esm.sh/react@18.3.1";
import ReactDOMClient from "https://esm.sh/react-dom@18.3.1/client?deps=react@18.3.1";
import {
  Search, ChevronRight, ChevronDown, ChevronLeft, X as XIcon, Check, Plus, Minus,
  Star, DollarSign, Calendar as CalendarIcon, HelpCircle, Pencil, Trash2, Car,
  Route, Smartphone, Bed, Plane, Info, AlertTriangle, Lightbulb, Loader2,
  Menu as MenuIcon, MoreHorizontal, MessageCircle, Phone, ExternalLink,
  CheckCircle2, XCircle, Zap, PenLine, AlertCircle, Compass, Layers,
  Image as ImageIcon, LayoutGrid, Map,
} from "https://esm.sh/lucide-react@0.383.0?deps=react@18.3.1";
import { marked } from "https://esm.sh/marked@12.0.2";
import Handlebars from "https://esm.sh/handlebars@4.7.8";

window.Handlebars = Handlebars;

window.React = ReactLib;
window.useState = useState;
window.useEffect = useEffect;
window.useMemo = useMemo;
window.useRef = useRef;
window.ReactDOM = ReactDOMClient;
window.marked = marked;
window.LucideIcons = {
  Search, ChevronRight, ChevronDown, ChevronLeft, XIcon, Check, Plus, Minus,
  Star, DollarSign, CalendarIcon, HelpCircle, Pencil, Trash2, Car, Route,
  Smartphone, Bed, Plane, Info, AlertTriangle, Lightbulb, Loader2, MenuIcon,
  MoreHorizontal, MessageCircle, Phone, ExternalLink, CheckCircle2, XCircle,
  Zap, PenLine, AlertCircle, Compass, Layers, ImageIcon, LayoutGrid, Map,
};
window.__bootReady = true;
window.dispatchEvent(new Event("apiary-boot-ready"));
