require("dotenv").config();

const express = require("express");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "مكتب_هبه_ابو_كيله_للمحاماة.html")
  );
});

app.get("/api/clients", async (req, res) => {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.post("/api/clients", async (req, res) => {
  const { id, name, case_no, case_type, case_date, status, details } = req.body;

  if (!id || !name) {
    return res.status(400).json({ error: "اسم العميل مطلوب" });
  }

  const { data, error } = await supabase
    .from("clients")
    .insert([{
      id,
      name,
      case_no,
      case_type,
      case_date: case_date || null,
      status,
      details
    }])
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});
app.put("/api/clients/:id", async (req, res) => {
  const { id } = req.params;
  const { name, case_no, case_type, case_date, status, details } = req.body;

  const { data, error } = await supabase
    .from("clients")
    .update({
      name,
      case_no,
      case_type,
      case_date: case_date || null,
      status,
      details
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});
app.delete("/api/clients/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true });
});
app.listen(PORT, () => {
  console.log(`الموقع يعمل على http://localhost:${PORT}`);
});
