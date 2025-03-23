const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
  {
    id: "4",
    content: "PUT request is used to update backend data",
    important: true,
  },
];

app.get("/", (request, response) => {
  response.end("<h1>Welcome</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = String(request.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) response.json(note);
  else response.status(404).end();
});

app.delete("/api/notes/:id", (request, response) => {
  const id = String(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const body = request.body;
  console.log(body);
  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const maxId =
    (notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0) + 1;

  const note = {
    id: String(maxId),
    content: body.content,
    important: body.important || false,
  };

  notes = [...notes, note];
  response.json(note);
});

app.put("/api/notes/:id", (request, response) => {
  const id = String(request.params.id);
  const body = request.body;

  notes = notes.map((note) => (note.id === id ? body : note));

  response.json(body);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
