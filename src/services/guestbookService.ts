import { collection, addDoc, getDocs, orderBy, query, limit, Timestamp } from 'firebase/firestore';
import { getFirebaseDb } from './firebase';
import { StickyNote } from '../types';

const COLLECTION = 'guestbook_notes';

export async function fetchGlobalGuestbookNotes(fallbackNotes: StickyNote[]): Promise<StickyNote[]> {
  const localNotes = loadFromLocalStorage(fallbackNotes);

  try {
    const db = getFirebaseDb();
    if (!db) return localNotes;

    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return localNotes;

    const cloudNotes = snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        author: d.author || "Visitor",
        role: d.role || "Guest",
        text: d.text || "",
        date: d.createdAt instanceof Timestamp
          ? d.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'Recently',
        rotation: d.rotation || "0deg",
        color: d.color || "bg-amber-950/40 border-amber-500/30 text-amber-200",
      } as StickyNote;
    });

    // Merge cloud notes with local notes (avoiding duplicates by text/author)
    const combined = [...cloudNotes];
    localNotes.forEach(localItem => {
      if (!combined.some(c => c.text === localItem.text && c.author === localItem.author)) {
        combined.push(localItem);
      }
    });

    return combined;
  } catch (err) {
    console.warn("Firestore fetch failed, falling back to local storage:", err);
    return localNotes;
  }
}

export async function saveGlobalGuestbookNote(
  newNote: StickyNote,
  currentNotes: StickyNote[]
): Promise<StickyNote[]> {
  const updated = [newNote, ...currentNotes];

  // Save to LocalStorage immediately
  try {
    localStorage.setItem('kaelos_sticky_notes', JSON.stringify(updated));
  } catch (e) {
    console.warn("LocalStorage save error:", e);
  }

  // Save to Firestore if available
  try {
    const db = getFirebaseDb();
    if (db) {
      await addDoc(collection(db, COLLECTION), {
        author: newNote.author,
        role: newNote.role,
        text: newNote.text,
        rotation: newNote.rotation,
        color: newNote.color,
        createdAt: Timestamp.now(),
      });
    }
  } catch (err) {
    console.warn("Firestore write error, note saved locally:", err);
  }

  return updated;
}

function loadFromLocalStorage(fallback: StickyNote[]): StickyNote[] {
  try {
    const saved = localStorage.getItem('kaelos_sticky_notes');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("LocalStorage load error:", e);
  }
  return fallback;
}
