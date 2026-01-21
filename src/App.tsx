import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

type Book = {
  title: string;
  author: string;
  year: number;
  genre: string;
  pages: number;
  read: boolean;
};

type LibraryContextType = {
  books: Book[];
  filteredBooks: Book[];
  searchTerm: string;
  sortBy: string;
  setSearchTerm: (value: string) => void;
  setSortBy: (value: string) => void;
  addBook: (book: Book) => void;
  toggleRead: (title: string) => void;
  deleteBook: (title: string) => void;
};

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error(
      "A useLibrary-t a LibraryProvider-en belül kell használni.",
    );
  }
  return context;
};

const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([
    {
      title: "1984",
      author: "George Orwell",
      year: 1949,
      genre: "Disztópia",
      pages: 328,
      read: true,
    },
    {
      title: "A Gyűrűk Ura",
      author: "J.R.R. Tolkien",
      year: 1954,
      genre: "Fantasy",
      pages: 1178,
      read: false,
    },
    {
      title: "Harry Potter és a bölcsek köve",
      author: "J.K. Rowling",
      year: 1997,
      genre: "Fantasy",
      pages: 223,
      read: true,
    },
    {
      title: "A Kőszívű Ember Fiai",
      author: "Jókai Mór",
      year: 1869,
      genre: "Történelmi",
      pages: 592,
      read: false,
    },
    {
      title: "Egri Csillagok",
      author: "Gárdonyi Géza",
      year: 1901,
      genre: "Történelmi",
      pages: 458,
      read: true,
    },
    {
      title: "Az Arany Ember",
      author: "Jókai Mór",
      year: 1873,
      genre: "Kaland",
      pages: 384,
      read: false,
    },
    {
      title: "Pál utcai fiúk",
      author: "Molnár Ferenc",
      year: 1906,
      genre: "Ifjúsági",
      pages: 232,
      read: true,
    },
    {
      title: "Lúdas Matyi",
      author: "Fazekas Mihály",
      year: 1817,
      genre: "Verses regény",
      pages: 124,
      read: false,
    },
    {
      title: "A Tanú",
      author: "Bacsó Péter",
      year: 1969,
      genre: "Szatíra",
      pages: 156,
      read: true,
    },
    {
      title: "Fahrenheit 451",
      author: "Ray Bradbury",
      year: 1953,
      genre: "Sci-fi",
      pages: 194,
      read: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");

  const addBook = (book: Book) => {
    setBooks([...books, book]);
  };

  const toggleRead = (title: string) => {
    const newBooks = books.map((book) => {
      if (book.title === title) {
        return {
          title: book.title,
          author: book.author,
          year: book.year,
          genre: book.genre,
          pages: book.pages,
          read: !book.read,
        };
      }
      return book;
    });

    setBooks(newBooks);
  };

  const deleteBook = (title: string) => {
    const newBooks = books.filter((book) => book.title !== title);
    setBooks(newBooks);
  };

  const filteredBooks = useMemo(() => {
    let result = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    result.sort((a, b) => {
      if (sortBy === "year") {
        return a.year - b.year;
      }
      return a[sortBy as "title" | "author"].localeCompare(
        b[sortBy as "title" | "author"],
      );
    });

    return result;
  }, [books, searchTerm, sortBy]);

  return (
    <LibraryContext.Provider
      value={{
        books,
        filteredBooks,
        searchTerm,
        sortBy,
        setSearchTerm,
        setSortBy,
        addBook,
        toggleRead,
        deleteBook,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useLibrary();

  return (
    <input
      placeholder="Keresés"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};

const SortControls = () => {
  const { sortBy, setSortBy } = useLibrary();

  return (
    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
      <option value="title">Cím</option>
      <option value="author">Szerző</option>
      <option value="year">Év</option>
    </select>
  );
};

const Stats = () => {
  const { books } = useLibrary();

  const readCount = books.filter((book) => book.read).length;

  return (
    <div>
      <p>Összes könyv: {books.length}</p>
      <p>Olvasott könyvek: {readCount}</p>
    </div>
  );
};

const BookList = () => {
  const { filteredBooks, toggleRead, deleteBook } = useLibrary();

  return (
    <ul>
      {filteredBooks.map((book) => (
        <li key={book.title}>
          <h3>{book.title}</h3>
          {book.author} ({book.year})
          <br />
          Műfaj: {book.genre} | Oldalak: {book.pages}
          <br />
          <button onClick={() => toggleRead(book.title)}>
            {book.read ? "Olvasott" : "Nem olvasott"}
          </button>
          <button onClick={() => deleteBook(book.title)}>Törlés</button>
        </li>
      ))}
    </ul>
  );
};

const AddBookForm = () => {
  const { addBook } = useLibrary();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [pages, setPages] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || !year) {
      alert("A cím, szerző és év kötelező!");
      return;
    }

    addBook({
      title,
      author,
      year: Number(year),
      genre,
      pages: Number(pages),
      read: false,
    });

    setTitle("");
    setAuthor("");
    setYear("");
    setGenre("");
    setPages("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Új könyv hozzáadása</h3>
      <input
        placeholder="Cím"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Szerző"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        placeholder="Év"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <input
        placeholder="Műfaj"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />
      <input
        placeholder="Oldalszám"
        value={pages}
        onChange={(e) => setPages(e.target.value)}
      />
      <button type="submit">Hozzáadás</button>
    </form>
  );
};

export default function App() {
  return (
    <LibraryProvider>
      <h1>Könyvtár</h1>
      <SearchBar />
      <SortControls />
      <Stats />
      <AddBookForm />
      <BookList />
    </LibraryProvider>
  );
}
