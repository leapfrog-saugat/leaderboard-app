import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Trash2 } from "lucide-react";

const categories = [
  "Foundation Models",
  "Open Source Models",
  "Code Generation",
  "Multimodal Capabilities",
  "Search/Knowledge Integration",
  "Enterprise Adoption",
  "Speed/Latency",
  "Accuracy/Evaluation Benchmarks",
  "Tool Ecosystem",
  "Safety & Alignment"
];

export default function AIDashboard() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("aiLeaderboardEntries");
    return saved
      ? JSON.parse(saved)
      : [
          {
            date: new Date(),
            category: categories[0],
            leader: "",
            runnerUp: "",
            notes: ""
          }
        ];
  });

  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    localStorage.setItem("aiLeaderboardEntries", JSON.stringify(entries));
  }, [entries]);

  const handleChange = (index, key, value) => {
    const updated = [...entries];
    updated[index][key] = key === "date" ? new Date(value) : value;
    setEntries(updated);
  };

  const addRow = () => {
    setEntries([
      ...entries,
      {
        date: new Date(),
        category: categories[0],
        leader: "",
        runnerUp: "",
        notes: ""
      }
    ]);
  };

  const deleteRow = (index) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
  };

  const getLeaderColor = (leader) => {
    if (!leader) return "text-black";
    const top = entries.filter((e) => e.leader === leader).length;
    if (top > 3) return "text-green-600 font-semibold";
    if (top > 1) return "text-yellow-600";
    return "text-black";
  };

  const filteredEntries = entries.filter((entry) => {
    const categoryMatch = filterCategory ? entry.category === filterCategory : true;
    const searchMatch =
      entry.leader.toLowerCase().includes(searchText.toLowerCase()) ||
      entry.runnerUp.toLowerCase().includes(searchText.toLowerCase()) ||
      entry.notes.toLowerCase().includes(searchText.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortBy === "date") return new Date(b.date) - new Date(a.date);
    if (sortBy === "category") return a.category.localeCompare(b.category);
    if (sortBy === "leader") return a.leader.localeCompare(b.leader);
    return 0;
  });

  return (
    <div className="p-6 grid gap-6">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-4">Editable AI Leaderboard</h2>
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <label className="font-medium">Filter by Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border rounded p-2"
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <label className="font-medium ml-4">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded p-2"
            >
              <option value="date">Date</option>
              <option value="category">Category</option>
              <option value="leader">Leader</option>
            </select>
            <label className="font-medium ml-4">Search:</label>
            <Input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search leader, runner-up, or notes"
              className="w-64"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Leader</TableHead>
                <TableHead>Runner-up</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEntries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      type="date"
                      value={new Date(entry.date).toISOString().split("T")[0]}
                      onChange={(e) => handleChange(index, "date", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <select
                      value={entry.category}
                      onChange={(e) => handleChange(index, "category", e.target.value)}
                      className="border rounded p-2 w-full"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={entry.leader}
                      className={getLeaderColor(entry.leader)}
                      onChange={(e) => handleChange(index, "leader", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={entry.runnerUp}
                      onChange={(e) => handleChange(index, "runnerUp", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={entry.notes}
                      onChange={(e) => handleChange(index, "notes", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" onClick={() => deleteRow(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Button onClick={addRow}>Add Row</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
